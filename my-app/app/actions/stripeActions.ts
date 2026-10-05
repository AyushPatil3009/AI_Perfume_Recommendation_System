'use server';

import { stripe } from '@/app/lib/stripe';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { sendPrescriptionEmail } from '@/app/lib/email';
import { parseUserPromptWithGemini } from '@/app/services/geminiService';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export interface CreateCheckoutInput {
  userId?: string;
  userEmail?: string;
  preferences: Record<string, unknown>;
}

export async function createCheckoutSessionAction(input: CreateCheckoutInput): Promise<{
  success: boolean;
  checkoutUrl?: string;
  message?: string;
}> {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return {
        success: false,
        message: 'Stripe is not configured. Please set STRIPE_SECRET_KEY in your .env file.',
      };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const preferencesJson = JSON.stringify(input.preferences || {});

    // Pre-Payment Intent Guard: If AI prompt mode, validate prompt relevance first
    const userPromptText = typeof input.preferences?.userPrompt === 'string' ? input.preferences.userPrompt.trim() : '';
    if (userPromptText && userPromptText.length >= 5) {
      const aiExtracted = await parseUserPromptWithGemini(userPromptText);
      if (aiExtracted.isOffTopic) {
        return {
          success: false,
          message: "Please describe a mood, season, memory, or scent preference (e.g. 'cozy rainy evening date' or 'fresh citrus office scent').",
        };
      }
    }

    // Single Scent Recommendation Pass price = $1.99 (199 cents USD)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: input.userEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'AI Perfume Sommelier Pass',
              description: '1 Personalized Ultra-Luxury Scent Curation powered by Gemini AI',
              images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop'],
            },
            unit_amount: 199, // $1.99 USD
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: input.userId || 'guest',
        preferences: preferencesJson.slice(0, 500), // Stripe metadata string limit safe
      },
      success_url: `${appUrl}/recommend/callback?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/recommend?payment_status=cancelled`,
    });

    // Always record transaction in DB (with guest or logged-in userId)
    try {
      await prisma.paymentTransaction.create({
        data: {
          userId: input.userId && input.userId !== 'guest' ? input.userId : null,
          customerEmail: input.userEmail || null,
          amount: 1.99,
          currency: 'USD',
          paymentMethod: 'STRIPE',
          stripeSessionId: session.id,
          promptMetadata: preferencesJson,
          status: 'PENDING',
          creditsAdded: 1,
        },
      });
      console.log(`📝 Created PENDING payment transaction for session: ${session.id}`);
    } catch (dbErr) {
      console.warn('⚠️ Could not create initial transaction record:', dbErr);
    }

    return {
      success: true,
      checkoutUrl: session.url || undefined,
    };
  } catch (error: any) {
    console.error('❌ Error creating Stripe Checkout Session:', error);
    return {
      success: false,
      message: error?.message || 'Failed to initiate Stripe checkout.',
    };
  }
}

export async function verifyAndFulfillCheckoutAction(sessionId: string): Promise<{
  success: boolean;
  message?: string;
  results?: any[];
  vibeSummary?: string;
}> {
  try {
    if (!sessionId) {
      return { success: false, message: 'Invalid checkout session ID.' };
    }

    // 1. Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return {
        success: false,
        message: 'Payment has not been completed yet.',
      };
    }

    const customerEmail = session.customer_details?.email || session.customer_email || undefined;
    const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : undefined;

    // 2. Mark database transaction as SUCCESS in PostgreSQL
    let transactionId = null;
    let userIdForLog = session.metadata?.userId && session.metadata.userId !== 'guest' ? session.metadata.userId : null;

    try {
      const updateResult = await pool.query(`
        UPDATE "payment_transactions"
        SET 
          "status" = 'SUCCESS',
          "paymentId" = COALESCE($1, "paymentId"),
          "customerEmail" = COALESCE($2, "customerEmail")
        WHERE "stripeSessionId" = $3
        RETURNING *;
      `, [paymentIntentId, customerEmail, sessionId]);

      if (updateResult.rowCount && updateResult.rowCount > 0) {
        transactionId = updateResult.rows[0].id;
        console.log(`✅ [SQL SUCCESS] Updated transaction status to SUCCESS for session: ${sessionId}`);
      } else {
        // If not found, insert fresh SUCCESS record
        transactionId = 'tx_' + Math.random().toString(36).slice(2, 11);
        await pool.query(`
          INSERT INTO "payment_transactions" (
            "id", "userId", "customerEmail", "amount", "currency", "paymentMethod", "paymentId", "stripeSessionId", "promptMetadata", "status", "creditsAdded", "createdAt"
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, 'SUCCESS', 1, NOW()
          );
        `, [
          transactionId,
          userIdForLog,
          customerEmail || null,
          session.amount_total ? session.amount_total / 100 : 1.99,
          (session.currency || 'USD').toUpperCase(),
          'STRIPE',
          paymentIntentId || null,
          sessionId,
          session.metadata?.preferences || null,
        ]);
        console.log(`✅ [SQL INSERT] Created fresh SUCCESS transaction for session: ${sessionId}`);
      }
    } catch (e) {
      console.error('❌ Could not update payment transaction in DB:', e);
    }

    // 3. Extract preferences from metadata
    let preferences: Record<string, unknown> = {};
    if (session.metadata?.preferences) {
      try {
        preferences = JSON.parse(session.metadata.preferences);
      } catch {
        preferences = {};
      }
    }

    // 4. Import and execute getRecommendationsAction
    const { getRecommendationsAction } = await import('@/app/actions/recommendActions');
    const recResponse = await getRecommendationsAction(preferences);

    // 5. Save the generated recommendations to the Database!
    if (recResponse.success && recResponse.results && userIdForLog && transactionId) {
      try {
        const logId = 'log_' + Math.random().toString(36).slice(2, 11);
        
        await pool.query(`
          INSERT INTO "recommendation_logs" (
            "id", "userId", "transactionId", "rawPrompt", "resultsJson", "createdAt"
          ) VALUES (
            $1, $2, $3, $4, $5, NOW()
          )
          ON CONFLICT ("transactionId") DO NOTHING;
        `, [
          logId,
          userIdForLog,
          transactionId,
          recResponse.vibeSummary || 'Custom Scent Profile',
          JSON.stringify(recResponse.results)
        ]);
        console.log(`✅ [SQL INSERT] Saved AI Results to RecommendationHistory`);
      } catch (logErr) {
        console.error('❌ Could not save recommendation history to DB:', logErr);
      }
    }

    // 6. Dispatch luxury Scent Prescription & Receipt Email via Resend
    if (recResponse.success && recResponse.results && customerEmail) {
      sendPrescriptionEmail({
        to: customerEmail,
        name: session.customer_details?.name || undefined,
        results: recResponse.results,
        rawPrompt: recResponse.vibeSummary || undefined,
        transactionId: transactionId || undefined,
      }).catch((emailErr) => {
        console.warn('⚠️ Prescription email could not be delivered:', emailErr);
      });
    }

    return recResponse;
  } catch (error: any) {
    console.error('❌ Error in verifyAndFulfillCheckoutAction:', error);
    return {
      success: false,
      message: error?.message || 'Failed to verify payment session.',
    };
  }
}
