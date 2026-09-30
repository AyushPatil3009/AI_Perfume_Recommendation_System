import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/app/lib/stripe';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import Stripe from 'stripe';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // In development when testing without local webhook forwarding
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: any) {
    console.error('⚠️ Stripe Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log('💰 Stripe Checkout Completed for Session:', session.id);

    try {
      const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : null;
      const customerEmail = session.customer_details?.email || session.customer_email || null;

      const updateRes = await pool.query(`
        UPDATE "payment_transactions"
        SET 
          "status" = 'SUCCESS',
          "paymentId" = COALESCE($1, "paymentId"),
          "customerEmail" = COALESCE($2, "customerEmail")
        WHERE "stripeSessionId" = $3
        RETURNING "userId";
      `, [paymentIntentId, customerEmail, session.id]);

      if (updateRes.rows.length > 0 && updateRes.rows[0].userId) {
        await pool.query(`
          UPDATE "users"
          SET "recommendationCredits" = "recommendationCredits" + 1
          WHERE "id" = $1;
        `, [updateRes.rows[0].userId]);
      }
      console.log(`✅ Webhook updated transaction for session: ${session.id}`);
    } catch (dbError) {
      console.error('❌ Failed to update payment record in webhook:', dbError);
    }
  }

  return NextResponse.json({ received: true });
}
