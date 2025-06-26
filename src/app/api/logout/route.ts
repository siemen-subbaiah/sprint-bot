import { NextRequest, NextResponse } from 'next/server';
import { clearTokens } from '@/lib/auth';

export async function POST(request: NextRequest) {
  await clearTokens();
  return NextResponse.redirect(new URL('/?logout=done', request.url));
}
