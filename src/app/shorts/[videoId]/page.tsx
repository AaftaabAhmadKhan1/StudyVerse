'use client';

import { use, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import ShortsPlayer from '@/components/ShortsPlayer';
import { useYTWallah } from '@/contexts/YTWallahContext';
import { Loader2, Flame } from 'lucide-react';
import Link from 'next/link';

interface ShortItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  viewCount: string;
  likeCount: string;
  publishedAt: string;
  channelTitle?: string;
  channelId?: string;
}

export default function ShortPlayerPage({ params }: { params: Promise<{ videoId: string }> }) {
  const { videoId } = use(params);
  const searchParams = useSearchParams();
  const channelId = searchParams.get('channel');

  const { channels, videos, siteSettings } = useYTWallah();
  const [shorts, setShorts] = useState<ShortItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialIndex, setInitialIndex] = useState(0);

  // Resolve channel info if channelId is provided
  const channel = channelId ? channels.find(c => c.id === channelId || c.youtubeChannelId === channelId) : null;

  // Fetch shorts from channel (YouTube API) or use local store
  const fetchShorts = useCallback(async () => {
    setLoading(true);

    // Try fetching from YouTube if we have channel info and API key
    if (channel && siteSettings.youtubeApiKey) {
      try {
        const res = await fetch('/api/youtube/channel-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channelId: channel.youtubeChannelId, apiKey: siteSettings.youtubeApiKey }),
        });
        const data = await res.json();
        if (res.ok && data.shorts?.length) {
          const mapped: ShortItem[] = data.shorts.map((s: Record<string, string>) => ({
            id: s.id,
            title: s.title,
            thumbnailUrl: s.thumbnailUrl,
            viewCount: s.viewCount,
            likeCount: s.likeCount,
            publishedAt: s.publishedAt,
            channelTitle: channel.name,
            channelId: channel.youtubeChannelId,
          }));
          setShorts(mapped);
          // Find the initial index for the current videoId
          const idx = mapped.findIndex(s => s.id === videoId);
          setInitialIndex(idx >= 0 ? idx : 0);
          setLoading(false);
          return;
        }
      } catch { /* fallback below */ }
    }

    // Fallback: use local store shorts
    const localShorts = videos.filter(v => v.type === 'short');
    if (localShorts.length > 0) {
      const mapped: ShortItem[] = localShorts.map(s => {
        const ch = channels.find(c => c.id === s.channelId);
        return {
          id: s.youtubeVideoId || s.id,
          title: s.title,
          thumbnailUrl: s.thumbnailUrl || `https://img.youtube.com/vi/${s.youtubeVideoId}/maxresdefault.jpg`,
          viewCount: '',
          likeCount: '',
          publishedAt: s.publishedAt || s.createdAt,
          channelTitle: ch?.name,
          channelId: ch?.youtubeChannelId,
        };
      });
      setShorts(mapped);
      const idx = mapped.findIndex(s => s.id === videoId);
      setInitialIndex(idx >= 0 ? idx : 0);
    } else {
      // Single short — just the video ID itself
      setShorts([{
        id: videoId,
        title: '',
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        viewCount: '',
        likeCount: '',
        publishedAt: '',
      }]);
      setInitialIndex(0);
    }

    setLoading(false);
  }, [channel, siteSettings.youtubeApiKey, videos, channels, videoId]);

  useEffect(() => { fetchShorts(); }, [fetchShorts]);

  // Build back link
  const backHref = channel ? `/channel/${channel.id}` : '/shorts';

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-3" />
          <p className="text-white/40 text-sm">Loading shorts...</p>
        </div>
      </div>
    );
  }

  return (
    <ShortsPlayer
      shorts={shorts}
      initialIndex={initialIndex}
      backHref={backHref}
      showBackButton={true}
    />
  );
}
