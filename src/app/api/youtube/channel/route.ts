import { NextRequest, NextResponse } from 'next/server';
import { fetchChannelByHandle, fetchChannelById } from '@/lib/youtube';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[api/channel] body=', body);
    const { handle, youtubeChannelId, apiKey } = body;

    if (!apiKey || (!handle && !youtubeChannelId)) {
      return NextResponse.json(
        { error: 'Missing apiKey or channel identifier' },
        { status: 400 }
      );
    }

    let data;
    if (youtubeChannelId) {
      // fetch by id when provided
      data = await fetchChannelById(youtubeChannelId, apiKey);
    } else {
      data = await fetchChannelByHandle(handle, apiKey);
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch channel';
    console.error('[api/channel] error', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
