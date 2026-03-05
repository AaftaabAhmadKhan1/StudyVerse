'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useYTWallah } from '@/contexts/YTWallahContext';
import { BookOpen, Clock, Play } from 'lucide-react';

export default function BatchCard({ batchId }: { batchId: string }) {
  const { batches, videos, channels } = useYTWallah();
  const batch = batches.find((b) => b.id === batchId);

  if (!batch) return null;

  const batchVideos = videos.filter((v) => v.batchId === batchId);
  const channel = channels.find((c) => c.id === batch.channelId);

  return (
    <Link href={`/channel/${batch.channelId}/batch/${batch.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="group relative bg-[#0f0a1f]/80 border border-purple-500/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all duration-300 overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-600/10 to-transparent rounded-bl-full" />

        <div className="relative z-10">
          {/* Batch name & channel */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
              {batch.name}
            </h3>
            {channel && <p className="text-xs text-purple-400/60 mt-0.5">{channel.name}</p>}
          </div>

          <p className="text-sm text-white/40 line-clamp-2 mb-4">{batch.description}</p>

          {/* Subjects */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {batch.subjects.map((subject) => (
              <span
                key={subject}
                className="px-2.5 py-1 text-[11px] font-medium bg-purple-500/10 text-purple-300 rounded-lg border border-purple-500/10"
              >
                {subject}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <Play className="w-3.5 h-3.5" />
              <span>{batchVideos.length} videos</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{batch.subjects.length} subjects</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
