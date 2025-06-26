import { cookies } from 'next/headers';

export interface ZohoTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface StoredTokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number; // Unix timestamp
}

const TOKEN_COOKIE_NAME = 'zoho_tokens';

export async function exchangeCodeForTokens(code: string): Promise<ZohoTokens> {
  const response = await fetch('https://accounts.zoho.in/oauth/v2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.NEXT_PUBLIC_ZOHO_CLIENT_ID!,
      client_secret: process.env.ZOHO_CLIENT_SECRET!,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL!,
      code,
    }),
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.statusText}`);
  }

  return response.json();
}

export async function getTokensFromCookies(): Promise<StoredTokenData | null> {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(TOKEN_COOKIE_NAME);

    if (!tokenCookie?.value) return null;

    return JSON.parse(tokenCookie.value);
  } catch (error) {
    console.error('Error parsing token cookie:', error);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const tokens = await getTokensFromCookies();
  if (!tokens) return false;

  const isExpired = Date.now() > tokens.expires_at - 5 * 60 * 1000;
  return !isExpired;
}

export async function clearTokens(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE_NAME);
}

export async function getAccessToken(): Promise<string | null> {
  const tokens = await getTokensFromCookies();
  return tokens?.access_token || null;
}
