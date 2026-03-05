import { NextRequest, NextResponse } from 'next/server';

const YT_API = 'https://www.googleapis.com/youtube/v3';

interface YTVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  duration: string;
  durationSec: number;
  viewCount: string;
  likeCount: string;
  type: 'video' | 'short' | 'live';
  isLive: boolean;
  isUpcoming: boolean;
  liveBroadcastContent: string;
  scheduledStartTime: string;
}

interface YTPlaylist {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  itemCount: number;
  publishedAt: string;
}

function parseDuration(iso: string): string {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return '';
  const h = m[1] ? `${m[1]}:` : '';
  const min = m[2] ? m[2].padStart(h ? 2 : 1, '0') : (h ? '00' : '0');
  const sec = m[3] ? m[3].padStart(2, '0') : '00';
  return `${h}${min}:${sec}`;
}

function parseDurationSec(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (parseInt(m[1] || '0') * 3600) + (parseInt(m[2] || '0') * 60) + parseInt(m[3] || '0');
}

/**
 * Detect if a video is a YouTube Short.
 * Only classify as short when there's a STRONG signal (explicit #shorts tag).
 * YouTube doesn't expose a direct "isShort" flag via Data API v3,
 * so we rely on metadata markers that creators/YouTube add.
 */
function detectShort(
  title: string, description: string, tags: string[],
  durationSec: number, hasLiveDetails: boolean
): boolean {
  if (hasLiveDetails) return false;
  // Shorts are at most 60 seconds
  if (durationSec === 0 || durationSec > 60) return false;

  const lTitle = title.toLowerCase();
  const lDesc = description.toLowerCase();
  const lTags = tags.map(t => t.toLowerCase());

  // Strong signal: #shorts hashtag in title, description, or tags
  if (lTitle.includes('#shorts') || lTitle.includes('#short')) return true;
  if (lDesc.includes('#shorts') || lDesc.includes('#short')) return true;
  if (lTags.includes('shorts') || lTags.includes('short')) return true;

  // Without an explicit #shorts marker, don't classify short videos as Shorts.
  // Many regular videos (clips, teasers, intros) are ≤60s but aren't Shorts.
  return false;
}

function formatCount(n: string): string {
  const num = parseInt(n, 10);
  if (isNaN(num)) return n;
  if (num >= 1e9) return `${(num / 1e9).toFixed(1).replace(/\.0$/, '')}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1).replace(/\.0$/, '')}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1).replace(/\.0$/, '')}K`;
  return n;
}

async function fetchChannelVideos(channelId: string, apiKey: string, maxResults = 200): Promise<YTVideo[]> {
  // Get upload playlist id
  const chRes = await fetch(`${YT_API}/channels?id=${channelId}&part=contentDetails&key=${apiKey}`);
  const chData = await chRes.json();
  const uploadsId = chData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsId) return [];

  // Paginate through playlist items (up to maxResults)
  interface PlaylistItem { contentDetails: { videoId: string } }
  const allItems: PlaylistItem[] = [];
  let pageToken = '';
  const maxPages = Math.ceil(maxResults / 50);

  for (let page = 0; page < maxPages; page++) {
    const pageSize = Math.min(50, maxResults - allItems.length);
    const url = `${YT_API}/playlistItems?playlistId=${uploadsId}&part=snippet,contentDetails&maxResults=${pageSize}&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ''}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.items?.length) break;
    allItems.push(...data.items);
    pageToken = data.nextPageToken || '';
    if (!pageToken || allItems.length >= maxResults) break;
  }

  if (!allItems.length) return [];

  // Fetch video details in batches of 50
  const allVideos: YTVideo[] = [];

  for (let i = 0; i < allItems.length; i += 50) {
    const batch = allItems.slice(i, i + 50);
    const videoIds = batch.map((item: PlaylistItem) => item.contentDetails.videoId).join(',');
    const vRes = await fetch(
      `${YT_API}/videos?id=${videoIds}&part=contentDetails,statistics,snippet,liveStreamingDetails&key=${apiKey}`
    );
    const vData = await vRes.json();

    for (const v of (vData.items || [])) {
      const snippet = v.snippet || {};
      const stats = v.statistics || {};
      const cd = v.contentDetails || {};
      const thumbnails = snippet.thumbnails || {};
      const liveBroadcast = snippet.liveBroadcastContent || 'none';
      const hasLiveDetails = !!v.liveStreamingDetails;
      const dur = cd.duration || '';
      const durationSec = parseDurationSec(dur);
      const title: string = snippet.title || '';
      const description: string = snippet.description || '';
      const tags: string[] = snippet.tags || [];

      const isLiveContent = liveBroadcast === 'live' || liveBroadcast === 'upcoming' || hasLiveDetails;
      const isShortVideo = !isLiveContent && detectShort(title, description, tags, durationSec, hasLiveDetails);

      allVideos.push({
        id: v.id,
        title,
        description: description.slice(0, 300),
        thumbnailUrl: thumbnails?.maxres?.url || thumbnails?.high?.url || thumbnails?.medium?.url || '',
        publishedAt: snippet.publishedAt || '',
        duration: parseDuration(dur),
        durationSec,
        viewCount: formatCount(stats.viewCount || '0'),
        likeCount: formatCount(stats.likeCount || '0'),
        type: isLiveContent ? 'live' : isShortVideo ? 'short' : 'video',
        isLive: liveBroadcast === 'live',
        isUpcoming: liveBroadcast === 'upcoming',
        liveBroadcastContent: liveBroadcast,
        scheduledStartTime: v.liveStreamingDetails?.scheduledStartTime || '',
      });
    }
  }

  return allVideos;
}

async function fetchChannelPlaylists(channelId: string, apiKey: string, maxResults = 25): Promise<YTPlaylist[]> {
  const res = await fetch(
    `${YT_API}/playlists?channelId=${channelId}&part=snippet,contentDetails&maxResults=${maxResults}&key=${apiKey}`
  );
  const data = await res.json();
  
  return (data.items || []).map((p: Record<string, Record<string, unknown>>) => {
    const snippet = p.snippet as Record<string, unknown>;
    const thumbnails = snippet.thumbnails as Record<string, { url: string }>;
    const cd = p.contentDetails as Record<string, number>;
    return {
      id: p.id as unknown as string,
      title: snippet.title as string,
      description: ((snippet.description as string) || '').slice(0, 200),
      thumbnailUrl: thumbnails?.high?.url || thumbnails?.medium?.url || '',
      itemCount: cd.itemCount || 0,
      publishedAt: snippet.publishedAt as string,
    } as YTPlaylist;
  });
}

export async function POST(request: NextRequest) {
  try {
    const { channelId, apiKey } = await request.json();
    if (!channelId || !apiKey) {
      return NextResponse.json({ error: 'Missing channelId or apiKey' }, { status: 400 });
    }

    const [videos, playlists] = await Promise.all([
      fetchChannelVideos(channelId, apiKey),
      fetchChannelPlaylists(channelId, apiKey),
    ]);

    // Separate by type
    const regularVideos = videos.filter(v => v.type === 'video');
    const shorts = videos.filter(v => v.type === 'short');
    const liveStreams = videos.filter(v => v.type === 'live' && !v.isUpcoming);
    const upcomingLives = videos.filter(v => v.type === 'live' && v.isUpcoming);

    return NextResponse.json({
      videos: regularVideos,
      shorts,
      liveStreams,
      upcomingLives,
      playlists,
      totalFetched: videos.length,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch channel content';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
