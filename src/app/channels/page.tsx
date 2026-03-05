'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import FooterNew from '@/components/FooterNew';
import ChannelCard from '@/components/ChannelCard';
import { useYTWallah } from '@/contexts/YTWallahContext';
import { Tv, Search } from 'lucide-react';
import { useState } from 'react';

export default function ChannelsPage() {
  const { channels } = useYTWallah();
  const [search, setSearch] = useState('');
  const activeChannels = channels.filter(c => c.isActive && c.name.toLowerCase().includes(search.toLowerCase()));

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
              <Tv className="w-7 h-7 text-purple-400" />
              <h1 className="text-3xl font-bold text-white">PW Channels</h1>
            </div>
            <p className="text-white/40">All Physics Wallah YouTube channels in one place</p>
          </motion.div>

          {/* Search */}
          <div className="relative mb-8 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search channels..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#0f0a1f] border border-purple-500/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-purple-500/30 text-sm"
            />
          </div>

          {/* Channels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeChannels.map((channel, i) => (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ChannelCard channelId={channel.id} />
              </motion.div>
            ))}
          </div>

          {activeChannels.length === 0 && (
            <div className="text-center py-24">
              <Tv className="w-16 h-16 text-white/10 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">No Channels Found</h2>
              <p className="text-white/40">No channels match your search.</p>
            </div>
          )}
        </div>
        <FooterNew />
      </div>
    </main>
  );
}
