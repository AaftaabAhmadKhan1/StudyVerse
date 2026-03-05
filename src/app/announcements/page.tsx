'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import FooterNew from '@/components/FooterNew';
import { useYTWallah } from '@/contexts/YTWallahContext';
import { Megaphone, AlertCircle, AlertTriangle, Bell, Info, Calendar } from 'lucide-react';

const priorityStyles = {
  urgent: 'border-red-500/30 bg-red-500/5',
  high: 'border-orange-500/30 bg-orange-500/5',
  medium: 'border-purple-500/30 bg-purple-500/5',
  low: 'border-blue-500/30 bg-blue-500/5',
};

const priorityTextStyles = {
  urgent: 'text-red-400',
  high: 'text-orange-400',
  medium: 'text-purple-400',
  low: 'text-blue-400',
};

const priorityBadgeStyles = {
  urgent: 'bg-red-500/20 text-red-300',
  high: 'bg-orange-500/20 text-orange-300',
  medium: 'bg-purple-500/20 text-purple-300',
  low: 'bg-blue-500/20 text-blue-300',
};

const priorityIcons = {
  urgent: AlertCircle,
  high: AlertTriangle,
  medium: Bell,
  low: Info,
};

export default function AnnouncementsPage() {
  const { announcements, batches } = useYTWallah();
  const activeAnnouncements = announcements.filter((a) => a.isActive);

  const globalAnns = activeAnnouncements.filter((a) => a.type === 'global');
  const batchAnns = activeAnnouncements.filter((a) => a.type === 'batch');

  return (
    <main className="min-h-screen bg-[#030014]">
      <Navigation />
      <div className="md:ml-52 lg:ml-60 pt-20 md:pt-0">
        <div className="px-6 py-12 max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Megaphone className="w-7 h-7 text-purple-400" />
              <h1 className="text-3xl font-bold text-white">Announcements</h1>
            </div>
            <p className="text-white/40">Stay updated with the latest news and announcements</p>
          </motion.div>

          {/* Global Announcements */}
          {globalAnns.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-purple-400" />
                General Announcements
              </h2>
              <div className="space-y-4">
                {globalAnns.map((ann, i) => {
                  const Icon = priorityIcons[ann.priority];
                  return (
                    <motion.div
                      key={ann.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`rounded-2xl border p-6 ${priorityStyles[ann.priority]}`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-2 rounded-xl ${priorityBadgeStyles[ann.priority]} bg-opacity-20`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3
                              className={`text-lg font-semibold ${priorityTextStyles[ann.priority]}`}
                            >
                              {ann.title}
                            </h3>
                            <span
                              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase ${priorityBadgeStyles[ann.priority]}`}
                            >
                              {ann.priority}
                            </span>
                          </div>
                          <p className="text-sm text-white/50 leading-relaxed">{ann.content}</p>
                          <div className="flex items-center gap-1.5 mt-3 text-xs text-white/25">
                            <Calendar className="w-3 h-3" />
                            {new Date(ann.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Batch Announcements */}
          {batchAnns.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-pink-400" />
                Batch Announcements
              </h2>
              <div className="space-y-4">
                {batchAnns.map((ann, i) => {
                  const Icon = priorityIcons[ann.priority];
                  const batch = batches.find((b) => b.id === ann.batchId);
                  return (
                    <motion.div
                      key={ann.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`rounded-2xl border p-6 ${priorityStyles[ann.priority]}`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-2 rounded-xl ${priorityBadgeStyles[ann.priority]} bg-opacity-20`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <h3
                              className={`text-lg font-semibold ${priorityTextStyles[ann.priority]}`}
                            >
                              {ann.title}
                            </h3>
                            <span
                              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase ${priorityBadgeStyles[ann.priority]}`}
                            >
                              {ann.priority}
                            </span>
                          </div>
                          {batch && (
                            <p className="text-xs text-purple-400/60 mb-2">Batch: {batch.name}</p>
                          )}
                          <p className="text-sm text-white/50 leading-relaxed">{ann.content}</p>
                          <div className="flex items-center gap-1.5 mt-3 text-xs text-white/25">
                            <Calendar className="w-3 h-3" />
                            {new Date(ann.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {activeAnnouncements.length === 0 && (
            <div className="text-center py-24">
              <Megaphone className="w-16 h-16 text-white/10 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">No Announcements</h2>
              <p className="text-white/40">Check back later for updates and announcements.</p>
            </div>
          )}
        </div>
        <FooterNew />
      </div>
    </main>
  );
}
