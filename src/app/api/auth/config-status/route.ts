import { NextResponse } from 'next/server';

function isConfigured(value: string | undefined) {
  return !!value && !value.startsWith('your_');
}

export async function GET() {
  return NextResponse.json({
    googleOAuthConfigured:
      isConfigured(process.env.AUTH_GOOGLE_ID) &&
      isConfigured(process.env.AUTH_GOOGLE_SECRET) &&
      !!process.env.AUTH_SECRET,
  });
}
