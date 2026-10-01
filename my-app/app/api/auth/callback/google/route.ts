import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { sendWelcomeEmail } from '@/app/lib/email';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * 🔄 GET /api/auth/callback/google
 * Handles the Google OAuth 2.0 callback, exchanges authorization code for user profile,
 * creates/updates the User in PostgreSQL via Prisma, sets session cookies, and synchronizes client session.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${appUrl}/api/auth/callback/google`;

  let redirectTo = '/recommend';
  if (state) {
    try {
      const parsedState = JSON.parse(state);
      if (parsedState.redirectTo) {
        redirectTo = parsedState.redirectTo;
      }
    } catch {
      // default fallback
    }
  }

  // 1. Handle user cancellation or OAuth error
  if (error || !code) {
    console.error('❌ Google OAuth error from callback:', error);
    return NextResponse.redirect(`${appUrl}/login?error=${encodeURIComponent(error || 'Access denied')}`);
  }

  if (!clientId || !clientSecret) {
    console.error('❌ Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env');
    return NextResponse.redirect(`${appUrl}/login?error=ConfigurationError`);
  }

  try {
    // 2. Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('❌ Failed to exchange code with Google:', tokenData);
      return NextResponse.redirect(`${appUrl}/login?error=TokenExchangeFailed`);
    }

    // 3. Fetch verified user profile from Google UserInfo endpoint
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const profile = await profileResponse.json();

    if (!profileResponse.ok || !profile.email) {
      console.error('❌ Failed to fetch Google user profile:', profile);
      return NextResponse.redirect(`${appUrl}/login?error=ProfileFetchFailed`);
    }

    const email = profile.email.toLowerCase().trim();
    const name = profile.name || email.split('@')[0];
    const image = profile.picture || null;

    // 4. Upsert User in PostgreSQL
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user record
      user = await prisma.user.create({
        data: {
          email,
          name,
          image,
          emailVerified: new Date(),
          subscriptionTier: 'FREE',
          recommendationCredits: 0,
        },
      });
      console.log(`✅ Created new Google OAuth user in DB: ${user.email} (ID: ${user.id})`);

      // Dispatch luxury welcome email asynchronously
      sendWelcomeEmail({
        to: user.email,
        name: user.name,
      }).catch((emailErr) => {
        console.warn('⚠️ Welcome email could not be delivered to Google user:', emailErr);
      });
    } else {
      // Existing user: update name/avatar if missing
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: user.name || name,
          image: user.image || image,
          emailVerified: user.emailVerified || new Date(),
        },
      });
      console.log(`✅ Existing user logged in via Google OAuth: ${user.email} (ID: ${user.id})`);
    }

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      credits: user.recommendationCredits,
      tier: user.subscriptionTier,
    };

    // 5. Build HTML response that populates localStorage and sets HTTP-only session cookie
    const targetUrl = redirectTo.startsWith('/') ? redirectTo : '/recommend';
    const jsonUser = JSON.stringify(userPayload).replace(/</g, '\\u003c');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authenticating with Google...</title>
  <style>
    body {
      background-color: #FAF7F2;
      color: #1C1610;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    .spinner {
      width: 44px;
      height: 44px;
      border: 3px solid rgba(197, 155, 75, 0.2);
      border-top-color: #C59B4B;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 20px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #1C1610;
    }
    .subtitle {
      font-size: 13px;
      color: #704C16;
      margin-top: 6px;
    }
  </style>
</head>
<body>
  <div class="spinner"></div>
  <div class="title">Securing Atelier Session...</div>
  <div class="subtitle">Signing you in with Google</div>
  <script>
    try {
      localStorage.setItem('aura_user', JSON.stringify(${jsonUser}));
    } catch (e) {
      console.error('Failed to set user storage', e);
    }
    window.location.replace('${targetUrl}');
  </script>
</body>
</html>`;

    const response = new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });

    // Set 30-day session cookie
    response.cookies.set('aura_session', user.id, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (err) {
    console.error('❌ Fatal error during Google OAuth callback:', err);
    return NextResponse.redirect(`${appUrl}/login?error=InternalOAuthError`);
  }
}
