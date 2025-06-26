import { exchangeCodeForTokens } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  if (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(new URL('/?error=oauth_error', request.url));
  }

  if (state !== 'testing') {
    console.error('Invalid state parameter');
    return NextResponse.redirect(new URL('/?error=invalid_state', request.url));
  }

  if (!code) {
    console.error('No authorization code received');
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    const tokens = await exchangeCodeForTokens(code);

    const response = NextResponse.redirect(
      new URL('/?success=logged_in', request.url)
    );

    const tokenData = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + tokens.expires_in * 1000,
    };

    response.cookies.set('zoho_tokens', JSON.stringify(tokenData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return NextResponse.redirect(
      new URL('/?error=token_exchange_failed', request.url)
    );
  }
}
