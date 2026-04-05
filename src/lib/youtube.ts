// ============================================================
// YouTube Data API v3 - Helper Functions
// ============================================================

export const YT_API_BASE = 'https://www.googleapis.com/youtube/v3';

export interface FetchedChannelData {
  youtubeChannelId: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  bannerUrl: string;
  subscriberCount: string;
  videoCount: string;
  handle: string;
}

/**
 * Format large numbers into human-readable strings (e.g. 25400000 → "25.4M")
 */
function formatCount(count: string): string {
  const n = parseInt(count, 10);
  if (isNaN(n)) return count;
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return count;
}

/**
 * Fetch channel data from YouTube Data API v3 by handle (@username)
 */
export async function fetchChannelByHandle(
  handle: string,
  apiKey: string
): Promise<FetchedChannelData> {
  // Clean up handle — remove @ if present, trim whitespace
  const cleanHandle = handle.trim().replace(/^@/, '');

  // Step 1: Search for the channel by handle using forHandle parameter
  const channelRes = await fetch(
    `${YT_API_BASE}/channels?forHandle=${encodeURIComponent(cleanHandle)}&part=snippet,statistics,brandingSettings&key=${apiKey}`
  );

  if (!channelRes.ok) {
    const err = await channelRes.json().catch(() => ({}));
    throw new Error(err?.error?.message || `YouTube API error: ${channelRes.status}`);
  }

  const channelData = await channelRes.json();

  if (!channelData.items || channelData.items.length === 0) {
    throw new Error(`No channel found for handle "@${cleanHandle}"`);
  }

  const channel = channelData.items[0];
  const snippet = channel.snippet;
  const stats = channel.statistics;
  const branding = channel.brandingSettings;

  return {
    youtubeChannelId: channel.id,
    name: snippet.title,
    description: snippet.description || '',
    thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || '',
    // Try multiple possible banner fields to maximize chance of getting an image
    bannerUrl:
      branding?.image?.bannerExternalUrl ||
      branding?.image?.bannerImageUrl ||
      branding?.image?.mobileBannerExternalUrl ||
      branding?.image?.large ||
      '',
    subscriberCount: formatCount(stats.subscriberCount || '0'),
    videoCount: formatCount(stats.videoCount || '0'),
    handle: snippet.customUrl || `@${cleanHandle}`,
  };
}

/**
 * Fetch channel data from YouTube Data API v3 using a channel ID.
 */
export async function fetchChannelById(
  id: string,
  apiKey: string
): Promise<FetchedChannelData> {
  const channelRes = await fetch(
    `${YT_API_BASE}/channels?id=${encodeURIComponent(id)}&part=snippet,statistics,brandingSettings&key=${apiKey}`
  );

  if (!channelRes.ok) {
    const err = await channelRes.json().catch(() => ({}));
    throw new Error(err?.error?.message || `YouTube API error: ${channelRes.status}`);
  }

  const channelData = await channelRes.json();
  if (!channelData.items || channelData.items.length === 0) {
    throw new Error(`No channel found for id "${id}"`);
  }

  const channel = channelData.items[0];
  const snippet = channel.snippet;
  const stats = channel.statistics;
  const branding = channel.brandingSettings;

  return {
    youtubeChannelId: channel.id,
    name: snippet.title,
    description: snippet.description || '',
    thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || '',
    bannerUrl:
      branding?.image?.bannerExternalUrl ||
      branding?.image?.bannerImageUrl ||
      branding?.image?.mobileBannerExternalUrl ||
      branding?.image?.large ||
      '',
    subscriberCount: formatCount(stats.subscriberCount || '0'),
    videoCount: formatCount(stats.videoCount || '0'),
    handle: snippet.customUrl || `@${id}`,
  };
}
