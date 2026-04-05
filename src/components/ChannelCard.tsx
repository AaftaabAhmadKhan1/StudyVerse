'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useYTWallah } from '@/contexts/YTWallahContext';
import { Tv, Video } from 'lucide-react';
import type { ReactNode } from 'react';

export default function ChannelCard({
  channelId,
  action,
}: {
  channelId: string;
  action?: ReactNode;
}) {
  const { channels } = useYTWallah();
  const { getDisplaySubscriberCount } = useAuth();
  const channel = channels.find((c) => c.id === channelId);

  if (!channel) return null;

  return (
    <Link href={`/channel/${channel.id}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative bg-[#0f0a1f]/80 border border-purple-500/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300"
      >
        {/* Banner */}
        <div
          className="h-28 relative overflow-hidden rounded-t-2xl"
          style={{
            background: channel.bannerUrl
              ? `url(${channel.bannerUrl}) center/cover no-repeat`
              : 'linear-gradient(90deg, rgba(124,58,237,0.15), rgba(236,72,153,0.08))',
          }}
        >
          <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl" />
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-pink-500/20 rounded-full blur-2xl" />
        </div>

        {/* Channel Info */}
        <div className="px-5 pb-5 -mt-8 relative z-10">
          <div className="flex items-end gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30 border-2 border-[#0f0a1f] flex-shrink-0">
              {channel.thumbnailUrl ? (
                <img
                  src={channel.thumbnailUrl}
                  alt={channel.name}
                  className="w-full h-full rounded-2xl object-cover"
                  onError={(e) => {
                    const t = e.currentTarget as HTMLImageElement;
                    t.onerror = null;
                    t.src = '/images/placeholder-channel.svg';
                  }}
                />
              ) : (
                <Tv className="w-7 h-7 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                {channel.name}
              </h3>
              <p className="text-xs text-white/40">
                {getDisplaySubscriberCount(channel.youtubeChannelId, channel.subscriberCount)} subscribers
              </p>
            </div>
          </div>

          <p className="text-sm text-white/50 line-clamp-2 mb-4">{channel.description}</p>

          {action ? <div className="mb-4">{action}</div> : null}

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <Video className="w-3.5 h-3.5" />
              <span>{channel.videoCount} videos</span>
            </div>
          </div>
        </div>

        {/* Hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5" />
        </div>
      </motion.div>
    </Link>
  );
}
