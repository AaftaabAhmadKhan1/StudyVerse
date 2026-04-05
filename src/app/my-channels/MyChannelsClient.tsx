'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Tv } from 'lucide-react';
import { useYTWallah } from '@/contexts/YTWallahContext';
import ChannelCard from '@/components/ChannelCard';

export default function MyChannelsClient() {
  const { myChannels, removeChannelFromMyChannels } = useYTWallah();
  const activeChannels = myChannels.filter((channel) => channel.isActive);

  return (
    <div className="min-h-screen bg-[#030014]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="mb-2 flex items-center gap-3">
            <Tv className="h-7 w-7 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">My Channels</h1>
          </div>
          <p className="text-white/40">
            Channels you add from the Channels page will appear here.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeChannels.map((channel, i) => (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <ChannelCard
                channelId={channel.id}
                action={
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      removeChannelFromMyChannels(channel.id);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-200 transition hover:border-red-500/35 hover:bg-red-500/15"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove Channel
                  </button>
                }
              />
            </motion.div>
          ))}
        </div>

        {activeChannels.length === 0 && (
          <div className="py-24 text-center">
            <Tv className="mx-auto mb-4 h-16 w-16 text-white/10" />
            <h2 className="mb-2 text-xl font-bold text-white">No Channels Found</h2>
            <p className="text-white/40">
              Go to Channels and add the YouTube channels you want to follow.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
