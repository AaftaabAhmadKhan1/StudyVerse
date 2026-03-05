'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useYTWallah } from '@/contexts/YTWallahContext';
import { Tv, BookOpen, Video, Megaphone, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const { isAdminAuthenticated, channels, batches, videos, announcements, mounted } = useYTWallah();

  useEffect(() => {
    if (mounted && !isAdminAuthenticated) {
      router.push('/admin/login');
    }
  }, [mounted, isAdminAuthenticated, router]);

  if (!mounted || !isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="text-white/20 animate-pulse">Loading...</div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Channels',
      value: channels.length,
      icon: Tv,
      color: 'purple',
      href: '/admin/channels',
    },
    {
      label: 'Batches',
      value: batches.length,
      icon: BookOpen,
      color: 'pink',
      href: '/admin/batches',
    },
    { label: 'Videos', value: videos.length, icon: Video, color: 'blue', href: '/admin/videos' },
    {
      label: 'Announcements',
      value: announcements.length,
      icon: Megaphone,
      color: 'orange',
      href: '/admin/announcements',
    },
  ];

  const colorMap: Record<string, string> = {
    purple: 'from-purple-600/20 to-purple-600/5 border-purple-500/20 text-purple-400',
    pink: 'from-pink-600/20 to-pink-600/5 border-pink-500/20 text-pink-400',
    blue: 'from-blue-600/20 to-blue-600/5 border-blue-500/20 text-blue-400',
    orange: 'from-orange-600/20 to-orange-600/5 border-orange-500/20 text-orange-400',
  };

  const recentVideos = [...videos]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  const activeChannels = channels.filter((c) => c.isActive);

  return (
    <div className="min-h-screen bg-[#030014]">
      <AdminSidebar />
      <div className="md:ml-56 lg:ml-64 pt-16 md:pt-0">
        <div className="px-6 py-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-white/40 text-sm">Welcome to YT Wallah Admin Panel</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Link key={stat.label} href={stat.href}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4 }}
                    className={`bg-gradient-to-br ${colorMap[stat.color]} border rounded-2xl p-5 cursor-pointer`}
                  >
                    <Icon className="w-6 h-6 mb-3" />
                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-white/40">{stat.label}</p>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0f0a1f]/60 border border-purple-500/10 rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" /> Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Add Channel', href: '/admin/channels', icon: Tv },
                  { label: 'Add Batch', href: '/admin/batches', icon: BookOpen },
                  { label: 'Add Video', href: '/admin/videos', icon: Video },
                  { label: 'New Announcement', href: '/admin/announcements', icon: Megaphone },
                ].map((action) => (
                  <Link key={action.label} href={action.href}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all"
                    >
                      <action.icon className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-white/70 font-medium">{action.label}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#0f0a1f]/60 border border-purple-500/10 rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" /> Recent Videos
              </h2>
              <div className="space-y-3">
                {recentVideos.length > 0 ? (
                  recentVideos.map((video) => (
                    <div
                      key={video.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all"
                    >
                      <div className="w-16 h-10 rounded-lg bg-[#1a1035] overflow-hidden flex-shrink-0">
                        <img
                          src={
                            video.thumbnailUrl ||
                            `https://img.youtube.com/vi/${video.youtubeVideoId}/default.jpg`
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/80 font-medium truncate">{video.title}</p>
                        <p className="text-[11px] text-white/30">
                          {video.subject} &bull; {video.type}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-white/30 text-center py-8">No videos yet</p>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-[#0f0a1f]/60 border border-purple-500/10 rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Tv className="w-5 h-5 text-purple-400" /> Active Channels ({activeChannels.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeChannels.map((channel) => (
                <div key={channel.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                    {channel.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{channel.name}</p>
                    <p className="text-[11px] text-white/30">
                      {channel.subscriberCount} &bull;{' '}
                      {videos.filter((v) => v.channelId === channel.id).length} videos
                    </p>
                  </div>
                </div>
              ))}
              {activeChannels.length === 0 && (
                <p className="text-sm text-white/30 col-span-full text-center py-4">
                  No active channels
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
