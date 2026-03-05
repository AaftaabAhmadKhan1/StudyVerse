import { NextRequest, NextResponse } from 'next/server';

const YT_API = 'https://www.googleapis.com/youtube/v3';

function formatCount(count: string): string {
  const n = parseInt(count, 10);
  if (isNaN(n)) return count;
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return count;
}

export async function POST(request: NextRequest) {
  try {
    const { videoId, apiKey } = await request.json();
    if (!videoId || !apiKey) {
      return NextResponse.json({ error: 'Missing videoId or apiKey' }, { status: 400 });
    }

    const res = await fetch(
      `${YT_API}/videos?id=${videoId}&part=snippet,statistics,contentDetails&key=${apiKey}`
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || 'YouTube API error');
    if (!data.items?.length) throw new Error('Video not found');

    const item = data.items[0];
    const snippet = item.snippet;
    const stats = item.statistics;

    return NextResponse.json({
      id: item.id,
      title: snippet.title,
      description: snippet.description || '',
      channelTitle: snippet.channelTitle,
      channelId: snippet.channelId,
      publishedAt: snippet.publishedAt,
      thumbnailUrl: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || '',
      viewCount: formatCount(stats.viewCount || '0'),
      likeCount: formatCount(stats.likeCount || '0'),
      commentCount: formatCount(stats.commentCount || '0'),
      viewCountRaw: stats.viewCount || '0',
      likeCountRaw: stats.likeCount || '0',
      commentCountRaw: stats.commentCount || '0',
      duration: item.contentDetails?.duration || '',
      tags: snippet.tags || [],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch video';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
