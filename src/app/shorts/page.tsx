'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import FooterNew from '@/components/FooterNew';
import ShortsPlayer from '@/components/ShortsPlayer';
import { useYTWallah } from '@/contexts/YTWallahContext';
import { Flame, Play, Eye, Loader2 } from 'lucide-react';

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

export default function ShortsPage() {
  const { videos, channels, myChannels, siteSettings } = useYTWallah();
  const [allShorts, setAllShorts] = useState<ShortItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [playerIndex, setPlayerIndex] = useState(0);

  // Fetch shorts from added channels via YouTube API, falling back to local store
  const fetchAllShorts = useCallback(async () => {
    setLoading(true);
    const collected: ShortItem[] = [];
    const activeChannels = myChannels.filter((channel) => channel.isActive);

    if (activeChannels.length === 0) {
      setAllShorts([]);
      setLoading(false);
      return;
    }

    if (siteSettings.youtubeApiKey && activeChannels.length > 0) {
      const fetches = activeChannels
        .map(async (ch) => {
          try {
            const res = await fetch('/api/youtube/channel-content', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                channelId: ch.youtubeChannelId,
                apiKey: siteSettings.youtubeApiKey,
              }),
            });
            const data = await res.json();
            if (res.ok && data.shorts?.length) {
              return data.shorts.map((s: Record<string, string>) => ({
                id: s.id,
                title: s.title,
                thumbnailUrl: s.thumbnailUrl,
                viewCount: s.viewCount,
                likeCount: s.likeCount,
                publishedAt: s.publishedAt,
                channelTitle: ch.name,
                channelId: ch.youtubeChannelId,
              }));
            }
          } catch {
            /* ignore */
          }
          return [];
        });

      const results = await Promise.all(fetches);
      for (const shorts of results) collected.push(...shorts);
      collected.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    }

    // Fallback to local store if no API results
    if (collected.length === 0) {
      const allowedChannelIds = new Set(activeChannels.map((channel) => channel.id));
      const localShorts = videos.filter(
        (video) => video.type === 'short' && allowedChannelIds.has(video.channelId)
      );
      for (const s of localShorts) {
        const ch = channels.find((c) => c.id === s.channelId);
        collected.push({
          id: s.youtubeVideoId || s.id,
          title: s.title,
          thumbnailUrl:
            s.thumbnailUrl || `https://img.youtube.com/vi/${s.youtubeVideoId}/maxresdefault.jpg`,
          viewCount: '',
          likeCount: '',
          publishedAt: s.publishedAt || s.createdAt,
          channelTitle: ch?.name,
          channelId: ch?.youtubeChannelId,
        });
      }
    }

    setAllShorts(collected);
    setLoading(false);
  }, [channels, myChannels, siteSettings.youtubeApiKey, videos]);

  useEffect(() => {
    fetchAllShorts();
  }, [fetchAllShorts]);

  useEffect(() => {
    if (myChannels.filter((channel) => channel.isActive).length === 0) {
      setAllShorts([]);
      setShowPlayer(false);
      setLoading(false);
    }
  }, [myChannels]);

  const handlePlayShort = (index: number) => {
    setPlayerIndex(index);
    setShowPlayer(true);
  };

  return (
    <>
      <main className="min-h-screen bg-[#030014]">
        <Navigation />
        <div className="md:ml-52 lg:ml-60 pt-20 md:pt-0">
          <div className="px-6 py-12 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-2">
                <Flame className="w-7 h-7 text-orange-400" />
                <h1 className="text-3xl font-bold text-white">Shorts</h1>
              </div>
              <p className="text-white/40">Quick bites from PW StudyVerse channels</p>
            </motion.div>

            {/* Loading */}
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                <span className="text-white/40 ml-3 text-sm">Loading shorts...</span>
              </div>
            ) : allShorts.length === 0 ? (
              <div className="text-center py-24">
                <Flame className="w-16 h-16 text-white/10 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">No Shorts Yet</h2>
                <p className="text-white/40">Shorts will appear here once channels are added.</p>
              </div>
            ) : (
              /* Shorts Grid */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {allShorts.map((short, i) => (
                  <motion.div
                    key={`${short.id}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <div onClick={() => handlePlayShort(i)} className="cursor-pointer">
                      <motion.div
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-purple-500/10 group bg-[#0f0a1f]"
                      >
                        <img
                          src={
                            short.thumbnailUrl ||
                            `https://img.youtube.com/vi/${short.id}/mqdefault.jpg`
                          }
                          alt={short.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        {/* Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                          </div>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-xs font-semibold text-white line-clamp-2 mb-1">
                            {short.title}
                          </p>
                          <div className="flex items-center justify-between">
                            {short.channelTitle && (
                              <p className="text-[10px] text-white/40">{short.channelTitle}</p>
                            )}
                            {short.viewCount && (
                              <p className="text-[10px] text-white/40 flex items-center gap-1">
                                <Eye className="w-2.5 h-2.5" />
                                {short.viewCount}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-orange-500 rounded-md text-[10px] text-white font-bold">
                          SHORT
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          {!showPlayer && <FooterNew />}
        </div>
      </main>

      {/* Full-screen Shorts Player */}
      <AnimatePresence>
        {showPlayer && allShorts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
          >
            <ShortsPlayer
              shorts={allShorts}
              initialIndex={playerIndex}
              onClose={() => setShowPlayer(false)}
              showBackButton={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
