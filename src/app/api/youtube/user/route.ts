import { NextRequest, NextResponse } from 'next/server';

const YT_API = 'https://www.googleapis.com/youtube/v3';

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();
    if (!accessToken) {
      return NextResponse.json({ error: 'Missing accessToken' }, { status: 400 });
    }

    const headers = { Authorization: `Bearer ${accessToken}` };

    // Fetch user's subscriptions, liked videos, and channel info in parallel
    const [subsRes, channelRes] = await Promise.all([
      fetch(`${YT_API}/subscriptions?part=snippet&mine=true&maxResults=50`, { headers }),
      fetch(`${YT_API}/channels?part=snippet,statistics&mine=true`, { headers }),
    ]);

    const subsData = await subsRes.json();
    const channelData = await channelRes.json();

    const subscriptions = (subsData.items || []).map((s: Record<string, Record<string, unknown>>) => {
      const snippet = s.snippet as Record<string, unknown>;
      const thumbnails = (snippet.thumbnails as Record<string, { url: string }>) || {};
      const resourceId = snippet.resourceId as Record<string, string>;
      return {
        channelId: resourceId?.channelId,
        title: snippet.title,
        thumbnailUrl: thumbnails?.medium?.url || thumbnails?.default?.url || '',
      };
    });

    const myChannel = channelData.items?.[0];
    const mySnippet = myChannel?.snippet || {};
    const myStats = myChannel?.statistics || {};
    const myThumbs = mySnippet.thumbnails || {};

    return NextResponse.json({
      subscriptions,
      myChannel: myChannel ? {
        id: myChannel.id,
        name: mySnippet.title,
        thumbnailUrl: myThumbs?.medium?.url || myThumbs?.default?.url || '',
        subscriberCount: myStats.subscriberCount || '0',
      } : null,
      subscriptionCount: subsData.pageInfo?.totalResults || subscriptions.length,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch user YouTube data';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
