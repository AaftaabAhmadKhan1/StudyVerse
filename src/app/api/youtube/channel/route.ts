import { NextRequest, NextResponse } from 'next/server';
import { fetchChannelByHandle } from '@/lib/youtube';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { handle, apiKey } = body;

    if (!handle || !apiKey) {
      return NextResponse.json(
        { error: 'Missing handle or apiKey' },
        { status: 400 }
      );
    }

    const data = await fetchChannelByHandle(handle, apiKey);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch channel';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
