import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim();
    const channelId = searchParams.get('channelId')?.trim();
    const apiKey = process.env.YOUTUBE_API_KEY || 'AIzaSyBsGZNsD-W2Wsc_YTUng-H8-hEJ6Nr9uVg';

    if (!q && !channelId) {
      return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
    }

    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&key=${apiKey}`;
    if (q) url += `&q=${encodeURIComponent(q)}`;
    if (channelId) url += `&channelId=${channelId}`;

    const resp = await fetch(url);
    const data = await resp.json();

    if (!resp.ok) throw new Error(data.error?.message || 'Failed search');

    const results = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
    }));

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
