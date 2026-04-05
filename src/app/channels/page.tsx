'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import FooterNew from '@/components/FooterNew';
import { Tv, CheckCircle2, X } from 'lucide-react';
import ChannelSearch from '@/components/ChannelSearch';

export default function ChannelsPage() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

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
            <p className="text-white/40">
              Search YouTube channels and add the ones you want to My Channels.
            </p>
          </motion.div>

          {/* YouTube search / add */}
          <div className="mb-6">
            <ChannelSearch onStatusMessage={setStatusMessage} />
          </div>

          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3"
            >
              <div className="flex items-center gap-2 text-sm text-emerald-200">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>{statusMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setStatusMessage(null)}
                className="text-emerald-200/60 transition hover:text-emerald-200"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </div>
        <FooterNew />
      </div>
    </main>
  );
}
