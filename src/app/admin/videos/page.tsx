'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useYTWallah } from '@/contexts/YTWallahContext';
import { Play, Plus, Trash2, Edit, X, Check, ExternalLink, Radio, Scissors } from 'lucide-react';

export default function AdminVideosPage() {
  const router = useRouter();
  const {
    isAdminAuthenticated,
    mounted,
    videos,
    channels,
    batches,
    addVideo,
    updateVideo,
    deleteVideo,
  } = useYTWallah();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    youtubeVideoId: '',
    channelId: '',
    batchId: '',
    subject: '',
    description: '',
    thumbnailUrl: '',
    duration: '',
    type: 'video' as 'video' | 'short' | 'live',
    isLive: false,
    publishedAt: new Date().toISOString(),
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

  const filteredBatches = batches.filter((b) => b.channelId === form.channelId);
  const selectedBatch = batches.find((b) => b.id === form.batchId);
  const availableSubjects = selectedBatch?.subjects || [];

  const resetForm = () => {
    setForm({
      title: '',
      youtubeVideoId: '',
      channelId: '',
      batchId: '',
      subject: '',
      description: '',
      thumbnailUrl: '',
      duration: '',
      type: 'video',
      isLive: false,
      publishedAt: new Date().toISOString(),
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateVideo(editingId, form);
    } else {
      addVideo(form);
    }
    resetForm();
  };

  const handleEdit = (video: (typeof videos)[0]) => {
    setForm({
      title: video.title,
      youtubeVideoId: video.youtubeVideoId,
      channelId: video.channelId,
      batchId: video.batchId,
      subject: video.subject,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      duration: video.duration,
      type: video.type,
      isLive: video.isLive,
      publishedAt: video.publishedAt,
    });
    setEditingId(video.id);
    setShowForm(true);
  };

  const typeIcon = (type: string) => {
    if (type === 'live') return <Radio className="w-3 h-3 text-red-400" />;
    if (type === 'short') return <Scissors className="w-3 h-3 text-blue-400" />;
    return <Play className="w-3 h-3 text-green-400" />;
  };

  return (
    <div className="min-h-screen bg-[#030014]">
      <AdminSidebar />
      <div className="md:ml-56 lg:ml-64 pt-16 md:pt-0">
        <div className="px-6 py-8 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Play className="w-7 h-7 text-green-400" /> Videos
              </h1>
              <p className="text-white/40 text-sm mt-1">Manage all video content</p>
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
              <Plus className="w-4 h-4" /> Add Video
            </motion.button>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <form
                  onSubmit={handleSubmit}
                  className="bg-[#0f0a1f]/60 border border-purple-500/10 rounded-2xl p-6 space-y-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-white">
                      {editingId ? 'Edit Video' : 'Add New Video'}
                    </h2>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="p-1 text-white/40 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-white/50 block mb-1">
                        Title *
                      </label>
                      <input
                        required
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30"
                        placeholder="Video title"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/50 block mb-1">
                        YouTube Video ID *
                      </label>
                      <input
                        required
                        value={form.youtubeVideoId}
                        onChange={(e) => setForm({ ...form, youtubeVideoId: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30"
                        placeholder="e.g. dQw4w9WgXcQ"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/50 block mb-1">Type *</label>
                      <select
                        required
                        value={form.type}
                        onChange={(e) =>
                          setForm({ ...form, type: e.target.value as 'video' | 'short' | 'live' })
                        }
                        className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30"
                      >
                        <option value="video">Video</option>
                        <option value="short">Short</option>
                        <option value="live">Live</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/50 block mb-1">
                        Channel *
                      </label>
                      <select
                        required
                        value={form.channelId}
                        onChange={(e) =>
                          setForm({ ...form, channelId: e.target.value, batchId: '', subject: '' })
                        }
                        className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30"
                      >
                        <option value="">Select channel</option>
                        {channels.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/50 block mb-1">
                        Batch *
                      </label>
                      <select
                        required
                        value={form.batchId}
                        onChange={(e) => setForm({ ...form, batchId: e.target.value, subject: '' })}
                        className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30"
                        disabled={!form.channelId}
                      >
                        <option value="">Select batch</option>
                        {filteredBatches.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/50 block mb-1">
                        Subject
                      </label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30"
                        disabled={!form.batchId}
                      >
                        <option value="">Select subject</option>
                        {availableSubjects.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/50 block mb-1">
                        Duration
                      </label>
                      <input
                        value={form.duration}
                        onChange={(e) => setForm({ ...form, duration: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30"
                        placeholder="e.g. 1:45:30"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-white/50 block mb-1">
                        Description
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30 resize-none"
                        placeholder="Video description..."
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/50 block mb-1">
                        Thumbnail URL
                      </label>
                      <input
                        value={form.thumbnailUrl}
                        onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30"
                        placeholder="Auto-generates from YouTube ID if blank"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.isLive}
                          onChange={(e) => setForm({ ...form, isLive: e.target.checked })}
                          className="rounded border-purple-500/30 bg-[#1a1035]"
                        />
                        <span className="text-sm text-white/60">Currently Live</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white text-sm font-semibold flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" /> {editingId ? 'Update' : 'Add'} Video
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

          <div className="space-y-3">
            {videos.map((video, i) => {
              const channel = channels.find((c) => c.id === video.channelId);
              const batch = batches.find((b) => b.id === video.batchId);
              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-[#0f0a1f]/60 border border-purple-500/10 rounded-xl p-4 hover:border-purple-500/20 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#1a1035]">
                      <img
                        src={
                          video.thumbnailUrl ||
                          `https://img.youtube.com/vi/${video.youtubeVideoId}/mqdefault.jpg`
                        }
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white truncate">{video.title}</h3>
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-white/5 rounded-md text-[10px] text-white/40 flex-shrink-0">
                          {typeIcon(video.type)} {video.type}
                        </span>
                        {video.isLive && (
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-md text-[10px] flex-shrink-0 animate-pulse">
                            LIVE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/30 truncate">
                        {channel?.name || '—'} • {batch?.name || '—'}
                        {video.subject ? ` • ${video.subject}` : ''}
                        {video.duration ? ` • ${video.duration}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={`https://youtube.com/watch?v=${video.youtubeVideoId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-white/30 hover:text-pink-400 hover:bg-pink-500/10 rounded-lg transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleEdit(video)}
                        className="p-2 text-white/30 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this video?')) deleteVideo(video.id);
                        }}
                        className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {videos.length === 0 && (
              <div className="text-center py-16">
                <Play className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-white/30">No videos yet. Add your first video!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
