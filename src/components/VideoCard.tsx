'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, Clock } from 'lucide-react';
import { Video } from '@/data/types';

const videoDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

export default function VideoCard({ video }: { video: Video }) {
  const isLive = video.isLive || video.type === 'live';
  const thumbnailUrl = video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeVideoId}/mqdefault.jpg`;

  return (
    <Link href={`/watch/${video.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="group relative bg-[#0f0a1f]/80 border border-purple-500/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video bg-[#1a1035] overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg`;
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-14 h-14 bg-purple-600/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg shadow-purple-500/30"
            >
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </motion.div>
          </div>

          {/* Duration badge */}
          {video.duration && !isLive && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 rounded-md text-xs text-white font-medium backdrop-blur-sm">
              {video.duration}
            </div>
          )}

          {/* Live badge */}
          {isLive && (
            <div className="absolute top-2 left-2 px-2.5 py-1 bg-red-600 rounded-lg text-xs text-white font-bold flex items-center gap-1.5 shadow-lg shadow-red-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              LIVE
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-2 mb-2">
            {video.title}
          </h3>
          
          <div className="flex items-center gap-3">
            {video.subject && (
              <span className="px-2 py-0.5 text-[10px] font-medium bg-purple-500/10 text-purple-300 rounded-md border border-purple-500/10">
                {video.subject}
              </span>
            )}
            <div className="flex items-center gap-1 text-[11px] text-white/30">
              <Clock className="w-3 h-3" />
              <span>{videoDateFormatter.format(new Date(video.publishedAt))}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
