import { NextRequest, NextResponse } from 'next/server';

/**
 * 🚀 GET /api/auth/google
 * Initiates the Google OAuth 2.0 flow by redirecting the user to Google's Consent Screen.
 */
export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectUri = `${appUrl}/api/auth/callback/google`;

  if (!clientId) {
    return NextResponse.json(
      { error: 'GOOGLE_CLIENT_ID is not configured in .env' },
      { status: 500 }
    );
  }

  // Preserve the intended target page (e.g., /recommend, /dashboard)
  const searchParams = request.nextUrl.searchParams;
  const redirectTo = searchParams.get('redirect') || '/recommend';

  // Construct Google OAuth URL
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'select_account');
  googleAuthUrl.searchParams.set('state', JSON.stringify({ redirectTo }));

  return NextResponse.redirect(googleAuthUrl.toString());
}
