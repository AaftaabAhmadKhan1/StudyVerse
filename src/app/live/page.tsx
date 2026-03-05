'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import FooterNew from '@/components/FooterNew';
import VideoCard from '@/components/VideoCard';
import { useYTWallah } from '@/contexts/YTWallahContext';
import { Radio } from 'lucide-react';

export default function LivePage() {
  const { videos } = useYTWallah();
  const liveVideos = videos.filter(v => v.isLive || v.type === 'live');

  return (
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
              <div className="relative">
                <Radio className="w-7 h-7 text-red-400" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white">Live Now</h1>
            </div>
            <p className="text-white/40">Currently streaming lectures and sessions</p>
          </motion.div>

          {/* Live Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {liveVideos.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <VideoCard video={video} />
              </motion.div>
            ))}
          </div>

          {liveVideos.length === 0 && (
            <div className="text-center py-24">
              <Radio className="w-16 h-16 text-white/10 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">No Live Streams</h2>
              <p className="text-white/40">There are no live streams at the moment. Check back later!</p>
            </div>
          )}
        </div>
        <FooterNew />
      </div>
    </main>
  );
}
