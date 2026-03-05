import { NextRequest, NextResponse } from 'next/server';

const YT_API = 'https://www.googleapis.com/youtube/v3';

function parseDuration(iso: string): string {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return '';
  const h = m[1] ? `${m[1]}:` : '';
  const min = m[2] ? m[2].padStart(h ? 2 : 1, '0') : (h ? '00' : '0');
  const sec = m[3] ? m[3].padStart(2, '0') : '00';
  return `${h}${min}:${sec}`;
}

function formatCount(n: string): string {
  const num = parseInt(n, 10);
  if (isNaN(num)) return n;
  if (num >= 1e9) return `${(num / 1e9).toFixed(1).replace(/\.0$/, '')}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1).replace(/\.0$/, '')}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1).replace(/\.0$/, '')}K`;
  return n;
}

export async function POST(request: NextRequest) {
  try {
    const { playlistId, apiKey } = await request.json();
    if (!playlistId || !apiKey) {
      return NextResponse.json({ error: 'Missing playlistId or apiKey' }, { status: 400 });
    }

    // Get playlist items (up to 50)
    const plRes = await fetch(
      `${YT_API}/playlistItems?playlistId=${playlistId}&part=snippet,contentDetails&maxResults=50&key=${apiKey}`
    );
    const plData = await plRes.json();
    if (!plData.items?.length) return NextResponse.json({ videos: [] });

    // Get video details
    const videoIds = plData.items
      .map((i: { contentDetails: { videoId: string } }) => i.contentDetails.videoId)
      .join(',');
    const vRes = await fetch(
      `${YT_API}/videos?id=${videoIds}&part=contentDetails,statistics,snippet&key=${apiKey}`
    );
    const vData = await vRes.json();

    const videos = (vData.items || []).map((v: Record<string, Record<string, unknown>>) => {
      const snippet = v.snippet as Record<string, unknown>;
      const stats = v.statistics as Record<string, string>;
      const cd = v.contentDetails as Record<string, string>;
      const thumbnails = snippet.thumbnails as Record<string, { url: string }>;

      return {
        id: v.id as unknown as string,
        title: snippet.title as string,
        description: ((snippet.description as string) || '').slice(0, 300),
        thumbnailUrl: thumbnails?.maxres?.url || thumbnails?.high?.url || thumbnails?.medium?.url || '',
        publishedAt: snippet.publishedAt as string,
        duration: parseDuration(cd.duration || ''),
        viewCount: formatCount(stats.viewCount || '0'),
        likeCount: formatCount(stats.likeCount || '0'),
      };
    });

    return NextResponse.json({ videos });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch playlist';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
