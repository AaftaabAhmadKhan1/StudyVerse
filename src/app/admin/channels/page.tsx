'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useYTWallah } from '@/contexts/YTWallahContext';
import {
  Tv,
  Plus,
  Trash2,
  Edit,
  X,
  Check,
  ExternalLink,
  Search,
  Loader2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

export default function AdminChannelsPage() {
  const router = useRouter();
  const {
    isAdminAuthenticated,
    mounted,
    channels,
    siteSettings,
    addChannel,
    updateChannel,
    deleteChannel,
  } = useYTWallah();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [handle, setHandle] = useState('');
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [fetched, setFetched] = useState(false);
  const [form, setForm] = useState({
    name: '',
    youtubeChannelId: '',
    description: '',
    thumbnailUrl: '',
    bannerUrl: '',
    subscriberCount: '',
    videoCount: '',
    isActive: true,
  });

  useEffect(() => {
    if (mounted && !isAdminAuthenticated) router.push('/admin/login');
  }, [mounted, isAdminAuthenticated, router]);

  if (!mounted || !isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="text-white/20 animate-pulse">Loading...</div>
      </div>
    );
  }

  const resetForm = () => {
    setForm({
      name: '',
      youtubeChannelId: '',
      description: '',
      thumbnailUrl: '',
      bannerUrl: '',
      subscriberCount: '',
      videoCount: '',
      isActive: true,
    });
    setHandle('');
    setFetchError('');
    setFetched(false);
    setEditingId(null);
    setShowForm(false);
  };

  const handleFetch = async () => {
    if (!handle.trim()) return;
    if (!siteSettings.youtubeApiKey) {
      setFetchError('YouTube API Key is not set. Go to Settings → YouTube API Key to add it.');
      return;
    }
    setFetching(true);
    setFetchError('');
    try {
      const res = await fetch('/api/youtube/channel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: handle.trim(), apiKey: siteSettings.youtubeApiKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch');

      setForm({
        name: data.name,
        youtubeChannelId: data.youtubeChannelId,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        bannerUrl: data.bannerUrl,
        subscriberCount: data.subscriberCount,
        videoCount: data.videoCount,
        isActive: true,
      });
      setFetched(true);
    } catch (err: unknown) {
      setFetchError(err instanceof Error ? err.message : 'Failed to fetch channel data');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateChannel(editingId, form);
    } else {
      addChannel(form);
    }
    resetForm();
  };

  const handleEdit = (channel: (typeof channels)[0]) => {
    setForm({
      name: channel.name,
      youtubeChannelId: channel.youtubeChannelId,
      description: channel.description,
      thumbnailUrl: channel.thumbnailUrl,
      bannerUrl: channel.bannerUrl,
      subscriberCount: channel.subscriberCount,
      videoCount: channel.videoCount,
      isActive: channel.isActive,
    });
    setEditingId(channel.id);
    setFetched(true);
    setShowForm(true);
  };

  const handleRefresh = async (channel: (typeof channels)[0]) => {
    if (!siteSettings.youtubeApiKey) return;
    try {
      // Try to extract handle from channel — or use the channel name
      const searchHandle = channel.name;
      const res = await fetch('/api/youtube/channel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: searchHandle, apiKey: siteSettings.youtubeApiKey }),
      });
      const data = await res.json();
      if (res.ok) {
        updateChannel(channel.id, {
          name: data.name,
          description: data.description,
          thumbnailUrl: data.thumbnailUrl,
          bannerUrl: data.bannerUrl,
          subscriberCount: data.subscriberCount,
          videoCount: data.videoCount,
        });
      }
    } catch {
      /* silently fail refresh */
    }
  };

  return (
    <div className="min-h-screen bg-[#030014]">
      <AdminSidebar />
      <div className="md:ml-56 lg:ml-64 pt-16 md:pt-0">
        <div className="px-6 py-8 max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Tv className="w-7 h-7 text-purple-400" /> Channels
              </h1>
              <p className="text-white/40 text-sm mt-1">
                Add channels by their YouTube @handle — everything is fetched automatically
              </p>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/20"
            >
              <Plus className="w-4 h-4" /> Add Channel
            </motion.button>
          </div>

          {/* No API Key Warning */}
          {!siteSettings.youtubeApiKey && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-300 font-medium">YouTube API Key Required</p>
                <p className="text-xs text-yellow-300/60 mt-1">
                  To auto-fetch channel data, add your YouTube Data API v3 key in{' '}
                  <button
                    onClick={() => router.push('/admin/settings')}
                    className="underline hover:text-yellow-200 transition-colors"
                  >
                    Settings
                  </button>
                  . Get one free at{' '}
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-yellow-200 transition-colors"
                  >
                    Google Cloud Console
                  </a>
                  .
                </p>
              </div>
            </motion.div>
          )}

          {/* Add Channel Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="bg-[#0f0a1f]/60 border border-purple-500/10 rounded-2xl p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                      {editingId ? 'Edit Channel' : 'Add New Channel'}
                    </h2>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="p-1 text-white/40 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Step 1: Enter handle */}
                  {!editingId && (
                    <div className="space-y-3">
                      <label className="text-xs font-medium text-white/50 block">
                        YouTube Channel Handle *
                      </label>
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 text-sm font-medium">
                            @
                          </span>
                          <input
                            value={handle}
                            onChange={(e) => {
                              setHandle(e.target.value);
                              setFetched(false);
                              setFetchError('');
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleFetch();
                              }
                            }}
                            className="w-full pl-9 pr-4 py-3 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30 transition-all"
                            placeholder="PhysicsWallah"
                            autoFocus
                          />
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={handleFetch}
                          disabled={fetching || !handle.trim()}
                          className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-40 shadow-lg shadow-purple-500/20"
                        >
                          {fetching ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Search className="w-4 h-4" />
                          )}
                          {fetching ? 'Fetching...' : 'Fetch'}
                        </motion.button>
                      </div>
                      {fetchError && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-red-400 flex items-center gap-1.5"
                        >
                          <AlertCircle className="w-3.5 h-3.5" /> {fetchError}
                        </motion.p>
                      )}
                    </div>
                  )}

                  {/* Step 2: Preview & confirm (auto-filled) */}
                  <AnimatePresence>
                    {fetched && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {/* Channel Preview Card */}
                        {form.thumbnailUrl && !editingId && (
                          <div className="mb-5 bg-[#1a1035]/60 border border-purple-500/10 rounded-xl p-4 flex items-center gap-4">
                            <img
                              src={form.thumbnailUrl}
                              alt=""
                              className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/20"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-semibold">{form.name}</h3>
                              <p className="text-xs text-white/40 mt-0.5">
                                {form.subscriberCount} subscribers • {form.videoCount} videos
                              </p>
                              <p className="text-xs text-white/30 mt-1 line-clamp-1">
                                {form.description}
                              </p>
                            </div>
                            <div className="flex-shrink-0 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
                              <span className="text-xs text-green-400 font-medium">✓ Found</span>
                            </div>
                          </div>
                        )}

                        {/* Editable details (collapsed by default for new, always shown for edit) */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <details className={editingId ? 'open' : ''}>
                            <summary className="text-xs font-medium text-white/40 cursor-pointer hover:text-white/60 transition-colors mb-3 select-none">
                              {editingId ? 'Channel Details' : '▸ Edit fetched details (optional)'}
                            </summary>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-medium text-white/50 block mb-1">
                                  Channel Name
                                </label>
                                <input
                                  value={form.name}
                                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                                  className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium text-white/50 block mb-1">
                                  YouTube Channel ID
                                </label>
                                <input
                                  value={form.youtubeChannelId}
                                  onChange={(e) =>
                                    setForm({ ...form, youtubeChannelId: e.target.value })
                                  }
                                  className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white/60 text-sm focus:outline-none focus:border-purple-500/30 font-mono text-[11px]"
                                  readOnly={!editingId}
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="text-xs font-medium text-white/50 block mb-1">
                                  Description
                                </label>
                                <textarea
                                  value={form.description}
                                  onChange={(e) =>
                                    setForm({ ...form, description: e.target.value })
                                  }
                                  rows={2}
                                  className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30 resize-none"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium text-white/50 block mb-1">
                                  Thumbnail URL
                                </label>
                                <input
                                  value={form.thumbnailUrl}
                                  onChange={(e) =>
                                    setForm({ ...form, thumbnailUrl: e.target.value })
                                  }
                                  className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium text-white/50 block mb-1">
                                  Banner URL
                                </label>
                                <input
                                  value={form.bannerUrl}
                                  onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })}
                                  className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium text-white/50 block mb-1">
                                  Subscribers
                                </label>
                                <input
                                  value={form.subscriberCount}
                                  onChange={(e) =>
                                    setForm({ ...form, subscriberCount: e.target.value })
                                  }
                                  className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium text-white/50 block mb-1">
                                  Videos
                                </label>
                                <input
                                  value={form.videoCount}
                                  onChange={(e) => setForm({ ...form, videoCount: e.target.value })}
                                  className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30"
                                />
                              </div>
                            </div>
                          </details>

                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={form.isActive}
                                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                className="rounded border-purple-500/30 bg-[#1a1035]"
                              />
                              <span className="text-sm text-white/60">Active</span>
                            </label>
                          </div>

                          <div className="flex items-center gap-3 pt-1">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="submit"
                              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/20"
                            >
                              <Check className="w-4 h-4" /> {editingId ? 'Update' : 'Add'} Channel
                            </motion.button>
                            <button
                              type="button"
                              onClick={resetForm}
                              className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/60 text-sm font-medium hover:bg-white/10 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Channels List */}
          <div className="space-y-3">
            {channels.map((channel, i) => (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-[#0f0a1f]/60 border border-purple-500/10 rounded-xl p-4 flex items-center gap-4 hover:border-purple-500/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                  {channel.thumbnailUrl ? (
                    <img
                      src={channel.thumbnailUrl}
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Tv className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white truncate">{channel.name}</h3>
                    {!channel.isActive && (
                      <span className="px-2 py-0.5 bg-white/5 text-white/30 text-[10px] rounded-md">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/30 truncate">
                    {channel.subscriberCount} subscribers • {channel.videoCount} videos
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {siteSettings.youtubeApiKey && (
                    <button
                      onClick={() => handleRefresh(channel)}
                      title="Refresh from YouTube"
                      className="p-2 text-white/20 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                  <a
                    href={`https://youtube.com/channel/${channel.youtubeChannelId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleEdit(channel)}
                    className="p-2 text-white/30 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this channel?')) deleteChannel(channel.id);
                    }}
                    className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
            {channels.length === 0 && (
              <div className="text-center py-16">
                <Tv className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-white/30">No channels yet. Add your first channel!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
