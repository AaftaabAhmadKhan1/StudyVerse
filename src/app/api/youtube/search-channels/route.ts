import { NextRequest, NextResponse } from 'next/server';
import { YT_API_BASE } from '@/lib/youtube';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim();
    // allow hard‑coded default if env var not set
    const apiKey = process.env.YOUTUBE_API_KEY || 'AIzaSyBsGZNsD-W2Wsc_YTUng-H8-hEJ6Nr9uVg';

    if (!q) {
      return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
    }
    // apiKey will always be present now

    // search channels by name
    console.log('[search-channels] query=', q);
    const resp = await fetch(
      `${YT_API_BASE}/search?part=snippet&type=channel&maxResults=10&q=${encodeURIComponent(q)}&key=${apiKey}`
    );

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err?.error?.message || `YouTube search error ${resp.status}`);
    }

    const data = await resp.json();

    const results = (data.items || []).map((item: any) => ({
      youtubeChannelId: item.snippet.channelId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl:
        item.snippet.thumbnails?.high?.url ||
        item.snippet.thumbnails?.default?.url ||
        '',
    }));

    console.log('[search-channels] returning', results.length, 'items');
    return NextResponse.json(results);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to search channels';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}