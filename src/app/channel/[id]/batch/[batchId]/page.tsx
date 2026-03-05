'use client';

import { use, useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import FooterNew from '@/components/FooterNew';
import VideoCard from '@/components/VideoCard';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import { useYTWallah } from '@/contexts/YTWallahContext';
import { BookOpen, ArrowLeft, Filter } from 'lucide-react';
import Link from 'next/link';

export default function BatchPage({ params }: { params: Promise<{ id: string; batchId: string }> }) {
  const { id, batchId } = use(params);
  const { batches, videos, channels, announcements } = useYTWallah();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const batch = batches.find(b => b.id === batchId);
  const channel = channels.find(c => c.id === id);
  const batchVideos = videos.filter(v => v.batchId === batchId);
  const batchAnnouncements = announcements.filter(a => a.isActive && a.type === 'batch' && a.batchId === batchId);

  const filteredVideos = selectedSubject === 'all'
    ? batchVideos
    : batchVideos.filter(v => v.subject === selectedSubject);

  if (!batch || !channel) {
    return (
      <main className="min-h-screen bg-[#030014]">
        <Navigation />
        <div className="md:ml-52 lg:ml-60 pt-20 md:pt-0 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Batch Not Found</h2>
            <Link href="/channels" className="text-purple-400 hover:text-purple-300">← Back to Channels</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#030014]">
      <Navigation />
      <div className="md:ml-52 lg:ml-60 pt-20 md:pt-0">
        <div className="px-6 py-8 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/30 mb-6">
            <Link href="/channels" className="hover:text-white transition-colors">Channels</Link>
            <span>/</span>
            <Link href={`/channel/${channel.id}`} className="hover:text-white transition-colors">{channel.name}</Link>
            <span>/</span>
            <span className="text-white/60">{batch.name}</span>
          </div>

          {/* Batch Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-7 h-7 text-purple-400" />
              <h1 className="text-3xl font-bold text-white">{batch.name}</h1>
            </div>
            <p className="text-white/40 max-w-2xl mb-4">{batch.description}</p>
            <p className="text-xs text-purple-400/60">
              {channel.name} • {batchVideos.length} videos • {batch.subjects.length} subjects
            </p>
          </motion.div>

          {/* Batch Announcements */}
          {batchAnnouncements.length > 0 && (
            <div className="mb-8">
              <AnnouncementBanner announcements={batchAnnouncements} />
            </div>
          )}

          {/* Subject Filter */}
          {batch.subjects.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-white/40" />
                <span className="text-sm font-medium text-white/40">Filter by Subject</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSubject('all')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedSubject === 'all'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  All ({batchVideos.length})
                </button>
                {batch.subjects.map(subject => {
                  const count = batchVideos.filter(v => v.subject === subject).length;
                  return (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedSubject === subject
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                          : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {subject} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredVideos.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <VideoCard video={video} />
              </motion.div>
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-24">
              <BookOpen className="w-16 h-16 text-white/10 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">No Videos Found</h2>
              <p className="text-white/40">No videos for this filter. Try selecting a different subject.</p>
            </div>
          )}
        </div>
        <FooterNew />
      </div>
    </main>
  );
}
