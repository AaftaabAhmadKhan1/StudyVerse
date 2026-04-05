import { NextRequest, NextResponse } from 'next/server';

const YT_API = 'https://www.googleapis.com/youtube/v3';
const INNERTUBE_KEY = 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';
const INNERTUBE_BROWSE_URL = `https://www.youtube.com/youtubei/v1/browse?key=${INNERTUBE_KEY}&prettyPrint=false`;
const INNERTUBE_CONTEXT = {
  client: {
    clientName: 'WEB',
    clientVersion: '2.20250301.00.00',
    hl: 'en',
    gl: 'US',
  },
};
const INNERTUBE_HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
};

// ─── In-memory cache: 5-minute TTL per channelId ─────────────────────────────
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
interface CacheEntry { data: unknown; expiresAt: number }
const channelCache = new Map<string, CacheEntry>();

function getCached(channelId: string): unknown | null {
  const entry = channelCache.get(channelId);
  if (entry && entry.expiresAt > Date.now()) return entry.data;
  channelCache.delete(channelId);
  return null;
}

function setCache(channelId: string, data: unknown) {
  channelCache.set(channelId, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

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
 * Detect if a video is likely a YouTube Short.
 * The Data API does not expose a dedicated Shorts flag, so we use
 * practical heuristics and bias toward showing genuine Shorts.
 */
function detectShort(
  title: string, description: string, tags: string[],
  durationSec: number, hasLiveDetails: boolean
): boolean {
  if (hasLiveDetails) return false;
  if (durationSec === 0 || durationSec > 180) return false;

  const lTitle = title.toLowerCase();
  const lDesc = description.toLowerCase();
  const lTags = tags.map((tag) => tag.toLowerCase());

  // Strong signal: #shorts hashtag in title, description, or tags
  if (lTitle.includes('#shorts') || lTitle.includes('#short')) return true;
  if (lDesc.includes('#shorts') || lDesc.includes('#short')) return true;
  if (lTags.includes('shorts') || lTags.includes('short')) return true;

  // Fall back to duration for strict separation.
  // This favors keeping Shorts out of the main Videos tab.
  return durationSec <= 180;
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
  const chRes = await fetch(
    `${YT_API}/channels?id=${channelId}&part=contentDetails&key=${apiKey}`,
    { next: { revalidate: 300 } }
  );
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
    const res = await fetch(url, { next: { revalidate: 300 } });
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
      `${YT_API}/videos?id=${videoIds}&part=contentDetails,statistics,snippet,liveStreamingDetails&key=${apiKey}`,
      { next: { revalidate: 300 } }
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

async function fetchChannelPlaylists(channelId: string, apiKey: string, maxResults = 200): Promise<YTPlaylist[]> {
  const playlists: YTPlaylist[] = [];
  let pageToken = '';
  const maxPages = Math.ceil(maxResults / 50);

  for (let page = 0; page < maxPages; page += 1) {
    const pageSize = Math.min(50, maxResults - playlists.length);
    const res = await fetch(
      `${YT_API}/playlists?channelId=${channelId}&part=snippet,contentDetails&maxResults=${pageSize}&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ''}`,
      { next: { revalidate: 300 } }
    );
    const data = await res.json();
    const items = data.items || [];
    if (!items.length) break;

    playlists.push(
      ...items.map((p: Record<string, Record<string, unknown>>) => {
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
      })
    );

    pageToken = data.nextPageToken || '';
    if (!pageToken || playlists.length >= maxResults) break;
  }

  return playlists;
}

async function fetchShortIdsFromYouTube(channelId: string): Promise<Set<string>> {
  try {
    const homepageRes = await fetch(INNERTUBE_BROWSE_URL, {
      method: 'POST',
      headers: INNERTUBE_HEADERS,
      body: JSON.stringify({ context: INNERTUBE_CONTEXT, browseId: channelId }),
      next: { revalidate: 300 },
    });

    if (!homepageRes.ok) return new Set<string>();
    const homepageText = await homepageRes.text();
    const homepageData = JSON.parse(homepageText);
    const tabs = homepageData?.contents?.twoColumnBrowseResultsRenderer?.tabs;
    if (!tabs || !Array.isArray(tabs)) return new Set<string>();

    let shortsParams = '';
    for (const tab of tabs) {
      const renderer = tab?.tabRenderer;
      const title = String(renderer?.title || '').toLowerCase();
      if (title === 'shorts') {
        shortsParams = renderer?.endpoint?.browseEndpoint?.params || '';
        break;
      }
    }

    if (!shortsParams) return new Set<string>();

    const shortsRes = await fetch(INNERTUBE_BROWSE_URL, {
      method: 'POST',
      headers: INNERTUBE_HEADERS,
      body: JSON.stringify({
        context: INNERTUBE_CONTEXT,
        browseId: channelId,
        params: shortsParams,
      }),
      next: { revalidate: 300 },
    });

    if (!shortsRes.ok) return new Set<string>();
    const shortsText = await shortsRes.text();
    const matches = shortsText.match(/"videoId":"([^"]+)"/g) || [];
    return new Set(matches.map((match) => match.slice(11, -1)));
  } catch {
    return new Set<string>();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { channelId, apiKey } = await request.json();
    if (!channelId || !apiKey) {
      return NextResponse.json({ error: 'Missing channelId or apiKey' }, { status: 400 });
    }

    // Return cached result if still fresh
    const cached = getCached(channelId);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { 'X-Cache': 'HIT' },
      });
    }

    const [videos, playlists, shortsTabIds] = await Promise.all([
      fetchChannelVideos(channelId, apiKey, 1000),
      fetchChannelPlaylists(channelId, apiKey),
      fetchShortIdsFromYouTube(channelId),
    ]);

    // Separate by type
    const liveStreams = videos.filter(v => v.type === 'live' && !v.isUpcoming);
    const upcomingLives = videos.filter(v => v.type === 'live' && v.isUpcoming);
    const nonLiveVideos = videos.filter(v => v.type !== 'live');
    const shorts = nonLiveVideos.filter(
      (v) =>
        shortsTabIds.has(v.id) ||
        v.type === 'short'
    );
    const shortsIdSet = new Set(shorts.map((video) => video.id));
    const regularVideos = nonLiveVideos.filter((v) => !shortsIdSet.has(v.id));

    const result = {
      videos: regularVideos,
      shorts,
      liveStreams,
      upcomingLives,
      playlists,
      totalFetched: videos.length,
    };

    setCache(channelId, result);

    return NextResponse.json(result, {
      headers: { 'X-Cache': 'MISS' },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch channel content';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
