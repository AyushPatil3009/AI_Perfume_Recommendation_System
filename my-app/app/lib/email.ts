import { Resend } from 'resend';
import { PerfumeRecommendationResult } from '@/app/types/recommendation';

function getResendClient() {
  const apiKey =
    process.env.RESEND_API_KEY ||
    process.env.RESEND_MAIL_API_KEY ||
    process.env.RESEND_MAIL_API_KEY ||
    process.env.RESEND_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey.trim());
}

const defaultFrom = process.env.RESEND_FROM_EMAIL || 'Aura Scent Atelier <onboarding@resend.dev>';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// ─── 1. Welcome Email Template ───────────────────────────────────────────────

export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name?: string | null;
}) {
  const resend = getResendClient();
  if (!resend) {
    console.warn('⚠️ [Resend] Skipped welcome email: RESEND_API_KEY or RESEND_MAIL_API_KEY is not set in .env');
    return { success: false, message: 'Resend API key missing' };
  }

  const displayName = name ? name.split(' ')[0] : 'Connoisseur';

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Aura Scent Atelier</title>
</head>
<body style="margin:0; padding:0; background-color:#FAF7F2; font-family:'Georgia', serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#1C1610;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#FAF7F2; padding:40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px; background-color:#FFFFFF; border-radius:20px; border:1px solid rgba(197, 155, 75, 0.35); box-shadow:0 10px 30px rgba(197, 155, 75, 0.08); overflow:hidden;">
          
          <!-- Top Gold Ribbon -->
          <tr>
            <td height="6" style="background:linear-gradient(90deg, #704C16 0%, #C59B4B 50%, #B8860B 100%);"></td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td align="center" style="padding:40px 30px 20px 30px;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="width:48px; height:48px; background-color:rgba(197, 155, 75, 0.12); border:1px solid rgba(197, 155, 75, 0.4); border-radius:14px; font-size:22px; line-height:48px;">
                    ✨
                  </td>
                </tr>
              </table>
              <h1 style="margin:16px 0 4px 0; font-family:'Georgia', serif; font-size:26px; font-weight:bold; letter-spacing:1px; color:#1C1610;">
                AURA SCENT
              </h1>
              <p style="margin:0; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size:10px; text-transform:uppercase; letter-spacing:3px; color:#9A7025; font-weight:600;">
                Haute Parfumerie AI Sommelier
              </p>
            </td>
          </tr>

          <!-- Divider Line -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px; background-color:rgba(197, 155, 75, 0.2);"></div>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding:32px 40px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size:15px; line-height:1.7; color:#3A332C;">
              <p style="margin-top:0; font-family:'Georgia', serif; font-size:20px; color:#1C1610;">
                Greetings, ${displayName},
              </p>
              <p>
                Welcome to the <strong>Aura Scent Atelier</strong>. We are delighted to invite you into an exclusive experience where mathematical olfactory science converges with high perfumery.
              </p>
              <p>
                Whether you desire a signature fragrance for an intimate candlelit evening, a Mediterranean citrus morning, or royal aged Cambodian oud, our Gemini AI sommelier is calibrated to distill your exact desires into 5 bespoke flacon recommendations.
              </p>

              <!-- Highlight Feature Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#FAF7F2; border-radius:14px; border:1px solid rgba(197, 155, 75, 0.25); margin:24px 0;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 8px 0; font-size:12px; text-transform:uppercase; letter-spacing:1.5px; font-weight:bold; color:#704C16;">
                      ✦ What Awaits in Your Scent Vault
                    </p>
                    <ul style="margin:0; padding-left:18px; font-size:13px; color:#5A5046; line-height:1.6;">
                      <li>Weighted note overlap matching across 6 data dimensions.</li>
                      <li>Permanent archive of every consultation you ever unlock.</li>
                      <li>Instant redirection links to verified official luxury retail stores.</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- Primary CTA Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:30px;">
                <tr>
                  <td align="center">
                    <a href="${appUrl}/recommend" target="_blank" style="display:inline-block; background:linear-gradient(135deg, #C59B4B 0%, #B8860B 100%); color:#FFFFFF; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size:14px; font-weight:600; text-decoration:none; padding:14px 36px; border-radius:30px; box-shadow:0 6px 20px rgba(197, 155, 75, 0.35);">
                      Begin Your First Consultation →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td style="padding:24px 40px; background-color:#FAF7F2; border-top:1px solid rgba(197, 155, 75, 0.2); font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size:12px; color:#8C8074; text-align:center;">
              <p style="margin:0 0 6px 0;">© 2026 Aura Scent AI. Haute Parfumerie Atelier.</p>
              <p style="margin:0;">
                <a href="${appUrl}" style="color:#9A7025; text-decoration:none;">Visit Atelier</a> &bull; 
                <a href="${appUrl}/dashboard" style="color:#9A7025; text-decoration:none;">My Scent Vault</a> &bull; 
                <a href="${appUrl}/about" style="color:#9A7025; text-decoration:none;">Our Philosophy</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const data = await resend.emails.send({
      from: defaultFrom,
      to,
      subject: '✨ Welcome to Aura Scent Atelier | Your Bespoke Olfactory Journey Begins',
      html: htmlContent,
    });
    console.log(`✉️ [Resend] Welcome email dispatched to ${to}:`, data);
    return { success: true, data };
  } catch (err: any) {
    console.error(`❌ [Resend] Failed to send welcome email to ${to}:`, err);
    return { success: false, message: err?.message };
  }
}

// ─── 2. Scent Prescription & Receipt Delivery Email ──────────────────────────

export async function sendPrescriptionEmail({
  to,
  name,
  results,
  rawPrompt,
  transactionId,
}: {
  to: string;
  name?: string | null;
  results: PerfumeRecommendationResult[];
  rawPrompt?: string;
  transactionId?: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    console.warn('⚠️ [Resend] Skipped prescription email: RESEND_API_KEY or RESEND_MAIL_API_KEY is not set in .env');
    return { success: false, message: 'Resend API key missing' };
  }

  const displayName = name ? name.split(' ')[0] : 'Connoisseur';
  const displayPrompt = rawPrompt || 'Custom Haute Fragrance Consultation';
  const orderRef = transactionId ? transactionId.slice(-8).toUpperCase() : Math.random().toString(36).slice(2, 8).toUpperCase();

  // Build Perfume Cards HTML
  const perfumesHtml = results.slice(0, 5).map((perfume, idx) => {
    const rank = idx + 1;
    const topNotes = perfume.top ? perfume.top.split(',').slice(0, 3).join(', ') : '';
    const heartNotes = perfume.middle ? perfume.middle.split(',').slice(0, 3).join(', ') : '';
    const baseNotes = perfume.base ? perfume.base.split(',').slice(0, 3).join(', ') : '';

    return `
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#FFFFFF; border:1px solid rgba(197, 155, 75, 0.28); border-radius:14px; margin-bottom:16px; box-shadow:0 3px 12px rgba(0,0,0,0.03); overflow:hidden;">
        <tr>
          <td style="padding:18px 20px;">
            <!-- Top Header in Card -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="left">
                  <span style="display:inline-block; background-color:rgba(197, 155, 75, 0.12); border:1px solid rgba(197, 155, 75, 0.35); border-radius:20px; padding:3px 10px; font-family:-apple-system, BlinkMacSystemFont, sans-serif; font-size:10px; font-weight:bold; color:#704C16; text-transform:uppercase; letter-spacing:1px;">
                    Rank #${rank}
                  </span>
                </td>
                <td align="right">
                  <span style="font-family:-apple-system, BlinkMacSystemFont, sans-serif; font-size:12px; font-weight:bold; color:#1C1610; background-color:#FAF7F2; padding:3px 8px; border-radius:6px; border:1px solid #E8E0D5;">
                    🔥 ${perfume.matchScore}% Match
                  </span>
                </td>
              </tr>
            </table>

            <!-- Perfume Name & Brand -->
            <h3 style="margin:12px 0 2px 0; font-family:'Georgia', serif; font-size:18px; font-weight:bold; color:#1C1610;">
              ${perfume.perfume}
            </h3>
            <p style="margin:0 0 10px 0; font-family:-apple-system, BlinkMacSystemFont, sans-serif; font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#8C8074; font-weight:600;">
              ${perfume.brand} &bull; ${perfume.gender || 'Unisex'}
            </p>

            ${perfume.aiExplanation ? `
              <div style="background-color:#FAF7F2; border-left:3px solid #C59B4B; padding:8px 12px; margin-bottom:12px; border-radius:4px; font-family:-apple-system, BlinkMacSystemFont, sans-serif; font-size:12px; color:#4A4035; font-style:italic; line-height:1.5;">
                “${perfume.aiExplanation}”
              </div>
            ` : ''}

            <!-- Notes summary -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family:-apple-system, BlinkMacSystemFont, sans-serif; font-size:11px; color:#5A5046; line-height:1.5;">
              ${topNotes ? `<tr><td style="width:45px; font-weight:bold; color:#9A7025; padding:2px 0;">Top:</td><td style="padding:2px 0;">${topNotes}</td></tr>` : ''}
              ${heartNotes ? `<tr><td style="width:45px; font-weight:bold; color:#9A7025; padding:2px 0;">Heart:</td><td style="padding:2px 0;">${heartNotes}</td></tr>` : ''}
              ${baseNotes ? `<tr><td style="width:45px; font-weight:bold; color:#9A7025; padding:2px 0;">Base:</td><td style="padding:2px 0;">${baseNotes}</td></tr>` : ''}
            </table>

            ${perfume.buyUrl ? `
              <div style="margin-top:14px; text-align:right;">
                <a href="${perfume.buyUrl}" target="_blank" style="display:inline-block; background-color:#FAF7F2; border:1px solid rgba(197, 155, 75, 0.4); color:#704C16; font-family:-apple-system, BlinkMacSystemFont, sans-serif; font-size:11px; font-weight:bold; text-decoration:none; padding:6px 14px; border-radius:6px;">
                  View Store Link ↗
                </a>
              </div>
            ` : ''}
          </td>
        </tr>
      </table>
    `;
  }).join('');

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Bespoke Scent Prescription</title>
</head>
<body style="margin:0; padding:0; background-color:#FAF7F2; font-family:'Georgia', serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#1C1610;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#FAF7F2; padding:30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px; background-color:#FFFFFF; border-radius:20px; border:1px solid rgba(197, 155, 75, 0.35); box-shadow:0 10px 30px rgba(197, 155, 75, 0.08); overflow:hidden;">
          
          <!-- Top Gold Ribbon -->
          <tr>
            <td height="6" style="background:linear-gradient(90deg, #704C16 0%, #C59B4B 50%, #B8860B 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding:36px 30px 16px 30px;">
              <span style="font-size:22px;">👑</span>
              <h1 style="margin:10px 0 4px 0; font-family:'Georgia', serif; font-size:24px; font-weight:bold; color:#1C1610;">
                Bespoke Scent Prescription
              </h1>
              <p style="margin:0; font-family:-apple-system, BlinkMacSystemFont, sans-serif; font-size:11px; text-transform:uppercase; letter-spacing:2px; color:#9A7025; font-weight:600;">
                Prescription Ref: #${orderRef} &bull; Paid $1.99 USD
              </p>
            </td>
          </tr>

          <!-- Vibe Profile Banner -->
          <tr>
            <td style="padding:0 30px 24px 30px;">
              <div style="background-color:#FAF7F2; border:1px solid rgba(197, 155, 75, 0.25); border-radius:12px; padding:16px 20px; text-align:center;">
                <span style="font-family:-apple-system, BlinkMacSystemFont, sans-serif; font-size:10px; text-transform:uppercase; letter-spacing:1.5px; font-weight:bold; color:#8C8074;">
                  Consultation Vibe Input
                </span>
                <p style="margin:6px 0 0 0; font-family:'Georgia', serif; font-size:15px; font-style:italic; color:#1C1610;">
                  "${displayPrompt}"
                </p>
              </div>
            </td>
          </tr>

          <!-- Perfume Matches Section -->
          <tr>
            <td style="padding:0 30px 24px 30px;">
              <h2 style="margin:0 0 16px 0; font-family:'Georgia', serif; font-size:17px; font-weight:bold; color:#1C1610; border-bottom:1px solid #EAE2D8; padding-bottom:8px;">
                Top 5 Masterpiece Selections
              </h2>
              ${perfumesHtml}
            </td>
          </tr>

          <!-- Scent Vault Button -->
          <tr>
            <td align="center" style="padding:0 30px 36px 30px;">
              <a href="${appUrl}/dashboard" target="_blank" style="display:inline-block; background:linear-gradient(135deg, #C59B4B 0%, #B8860B 100%); color:#FFFFFF; font-family:-apple-system, BlinkMacSystemFont, sans-serif; font-size:14px; font-weight:600; text-decoration:none; padding:14px 32px; border-radius:30px; box-shadow:0 6px 20px rgba(197, 155, 75, 0.35);">
                ✨ Open in My Scent Vault →
              </a>
              <p style="margin:12px 0 0 0; font-family:-apple-system, BlinkMacSystemFont, sans-serif; font-size:11px; color:#8C8074;">
                This prescription has been permanently saved to your Aura Scent Vault.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 30px; background-color:#FAF7F2; border-top:1px solid rgba(197, 155, 75, 0.2); font-family:-apple-system, BlinkMacSystemFont, sans-serif; font-size:11px; color:#8C8074; text-align:center;">
              <p style="margin:0 0 4px 0;">Aura Scent AI &bull; Haute Parfumerie Sommelier &bull; Verified Stripe Payment</p>
              <p style="margin:0;">Support: concierge@aurascent.ai</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const data = await resend.emails.send({
      from: defaultFrom,
      to,
      subject: `👑 Your Bespoke Fragrance Prescription & Receipt (Ref #${orderRef})`,
      html: htmlContent,
    });
    console.log(`✉️ [Resend] Prescription email dispatched to ${to}:`, data);
    return { success: true, data };
  } catch (err: any) {
    console.error(`❌ [Resend] Failed to send prescription email to ${to}:`, err);
    return { success: false, message: err?.message };
  }
}

// ─── 3. Contact Us / Concierge Inquiry Email ─────────────────────────────────

export async function sendContactEmail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    console.warn('⚠️ [Resend] Skipped contact email: RESEND_API_KEY is not set in .env');
    return { success: false, message: 'Resend API key missing' };
  }

  const toEmail = process.env.ADMIN_EMAIL || process.env.RESEND_TO_EMAIL || 'ayushpatil30905@gmail.com';

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Atelier Inquiry</title>
</head>
<body style="margin:0; padding:0; background-color:#FAF7F2; font-family:'Georgia', serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#1C1610;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#FAF7F2; padding:30px 10px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px; background-color:#FFFFFF; border-radius:20px; border:1px solid rgba(197, 155, 75, 0.35); box-shadow:0 10px 30px rgba(197, 155, 75, 0.08); overflow:hidden;">
          <tr>
            <td height="6" style="background:linear-gradient(90deg, #704C16 0%, #C59B4B 50%, #B8860B 100%);"></td>
          </tr>
          <tr>
            <td style="padding:32px 30px;">
              <h2 style="margin:0 0 4px 0; font-family:'Georgia', serif; font-size:22px; color:#1C1610;">
                ✉️ New Concierge Inquiry
              </h2>
              <p style="margin:0 0 20px 0; font-family:-apple-system, sans-serif; font-size:12px; text-transform:uppercase; letter-spacing:1.5px; color:#9A7025; font-weight:600;">
                Aura Scent Atelier Contact Form
              </p>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#FAF7F2; border-radius:12px; border:1px solid rgba(197, 155, 75, 0.25); padding:16px 20px; font-family:-apple-system, sans-serif; font-size:13px; line-height:1.6; margin-bottom:20px;">
                <tr>
                  <td style="padding:4px 0; font-weight:bold; color:#704C16; width:80px;">From:</td>
                  <td style="padding:4px 0; color:#1C1610;">${name}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0; font-weight:bold; color:#704C16;">Email:</td>
                  <td style="padding:4px 0; color:#1C1610;"><a href="mailto:${email}" style="color:#9A7025; font-weight:600;">${email}</a></td>
                </tr>
              </table>

              <div style="background-color:#FFFFFF; border-left:3px solid #C59B4B; padding:16px; border:1px solid #EAE2D8; border-left:3px solid #C59B4B; border-radius:8px; font-family:-apple-system, sans-serif; font-size:14px; line-height:1.6; color:#3A332C;">
                <p style="margin:0 0 8px 0; font-weight:bold; color:#704C16; font-size:11px; text-transform:uppercase; letter-spacing:1px;">Message:</p>
                <p style="margin:0; white-space:pre-wrap;">${message}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 30px; background-color:#FAF7F2; border-top:1px solid rgba(197, 155, 75, 0.2); font-family:-apple-system, sans-serif; font-size:11px; color:#8C8074; text-align:center;">
              Aura Scent AI Concierge System &bull; Received ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const data = await resend.emails.send({
      from: defaultFrom,
      to: toEmail,
      subject: `✉️ New Atelier Inquiry from ${name} (${email})`,
      html: htmlContent,
      replyTo: email,
    });
    console.log(`✉️ [Resend] Contact inquiry forwarded to admin (${toEmail}):`, data);
    return { success: true, data };
  } catch (err: any) {
    console.error(`❌ [Resend] Failed to forward contact inquiry:`, err);
    return { success: false, message: err?.message };
  }
}

