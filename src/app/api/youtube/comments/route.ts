import { NextRequest, NextResponse } from 'next/server';

const YT_API = 'https://www.googleapis.com/youtube/v3';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function formatCount(count: string): string {
  const n = parseInt(count, 10);
  if (isNaN(n)) return count;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return count;
}

export async function POST(request: NextRequest) {
  try {
    const { videoId, apiKey, pageToken } = await request.json();
    if (!videoId || !apiKey) {
      return NextResponse.json({ error: 'Missing videoId or apiKey' }, { status: 400 });
    }

    const url = `${YT_API}/commentThreads?videoId=${videoId}&part=snippet,replies&maxResults=20&order=relevance&textFormat=plainText&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ''}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      // Comments might be disabled
      if (data?.error?.errors?.[0]?.reason === 'commentsDisabled') {
        return NextResponse.json({ comments: [], nextPageToken: null, totalResults: 0, disabled: true });
      }
      throw new Error(data?.error?.message || 'YouTube API error');
    }

    const comments = (data.items || []).map((item: any) => {
      const top = item.snippet.topLevelComment.snippet;
      const replies = (item.replies?.comments || []).map((r: any) => ({
        id: r.id,
        authorName: r.snippet.authorDisplayName,
        authorImage: r.snippet.authorProfileImageUrl,
        text: r.snippet.textDisplay,
        likeCount: formatCount(String(r.snippet.likeCount || 0)),
        publishedAt: r.snippet.publishedAt,
        timeAgo: timeAgo(r.snippet.publishedAt),
      }));

      return {
        id: item.id,
        authorName: top.authorDisplayName,
        authorImage: top.authorProfileImageUrl,
        text: top.textDisplay,
        likeCount: formatCount(String(top.likeCount || 0)),
        replyCount: item.snippet.totalReplyCount || 0,
        publishedAt: top.publishedAt,
        timeAgo: timeAgo(top.publishedAt),
        replies,
      };
    });

    return NextResponse.json({
      comments,
      nextPageToken: data.nextPageToken || null,
      totalResults: data.pageInfo?.totalResults || 0,
      disabled: false,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch comments';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
