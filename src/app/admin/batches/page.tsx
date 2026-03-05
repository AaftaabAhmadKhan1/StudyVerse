'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useYTWallah } from '@/contexts/YTWallahContext';
import { BookOpen, Plus, Trash2, Edit, X, Check, Tag } from 'lucide-react';

export default function AdminBatchesPage() {
  const router = useRouter();
  const { isAdminAuthenticated, mounted, batches, channels, addBatch, updateBatch, deleteBatch } =
    useYTWallah();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [subjectInput, setSubjectInput] = useState('');
  const [form, setForm] = useState({
    name: '',
    channelId: '',
    description: '',
    thumbnailUrl: '',
    subjects: [] as string[],
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
      channelId: '',
      description: '',
      thumbnailUrl: '',
      subjects: [],
      isActive: true,
    });
    setSubjectInput('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddSubject = () => {
    if (subjectInput.trim() && !form.subjects.includes(subjectInput.trim())) {
      setForm({ ...form, subjects: [...form.subjects, subjectInput.trim()] });
      setSubjectInput('');
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setForm({ ...form, subjects: form.subjects.filter((s) => s !== subject) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateBatch(editingId, form);
    } else {
      addBatch(form);
    }
    resetForm();
  };

  const handleEdit = (batch: (typeof batches)[0]) => {
    setForm({
      name: batch.name,
      channelId: batch.channelId,
      description: batch.description,
      thumbnailUrl: batch.thumbnailUrl,
      subjects: [...batch.subjects],
      isActive: batch.isActive,
    });
    setEditingId(batch.id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-[#030014]">
      <AdminSidebar />
      <div className="md:ml-56 lg:ml-64 pt-16 md:pt-0">
        <div className="px-6 py-8 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <BookOpen className="w-7 h-7 text-pink-400" /> Batches
              </h1>
              <p className="text-white/40 text-sm mt-1">Manage course batches and series</p>
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
              <Plus className="w-4 h-4" /> Add Batch
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
                      {editingId ? 'Edit Batch' : 'Add New Batch'}
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
                    <div>
                      <label className="text-xs font-medium text-white/50 block mb-1">
                        Batch Name *
                      </label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30"
                        placeholder="Lakshya JEE 2026"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/50 block mb-1">
                        Channel *
                      </label>
                      <select
                        required
                        value={form.channelId}
                        onChange={(e) => setForm({ ...form, channelId: e.target.value })}
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
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-white/50 block mb-1">
                        Description
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30 resize-none"
                        placeholder="Batch description..."
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
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/50 block mb-1">
                        Subjects
                      </label>
                      <div className="flex gap-2">
                        <input
                          value={subjectInput}
                          onChange={(e) => setSubjectInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddSubject();
                            }
                          }}
                          className="flex-1 px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30"
                          placeholder="e.g. Physics"
                        />
                        <button
                          type="button"
                          onClick={handleAddSubject}
                          className="px-3 py-2.5 bg-purple-600/20 border border-purple-500/20 rounded-xl text-purple-400 text-sm hover:bg-purple-600/30 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      {form.subjects.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {form.subjects.map((s) => (
                            <span
                              key={s}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-500/10 text-purple-300 rounded-lg text-xs border border-purple-500/10"
                            >
                              <Tag className="w-3 h-3" /> {s}
                              <button
                                type="button"
                                onClick={() => handleRemoveSubject(s)}
                                className="ml-1 hover:text-red-400"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
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
                  <div className="flex items-center gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white text-sm font-semibold flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" /> {editingId ? 'Update' : 'Add'} Batch
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
            {batches.map((batch, i) => {
              const channel = channels.find((c) => c.id === batch.channelId);
              return (
                <motion.div
                  key={batch.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-[#0f0a1f]/60 border border-purple-500/10 rounded-xl p-4 hover:border-purple-500/20 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-600/30 to-purple-600/30 flex items-center justify-center flex-shrink-0 border border-pink-500/10">
                      <BookOpen className="w-5 h-5 text-pink-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white truncate">{batch.name}</h3>
                        {!batch.isActive && (
                          <span className="px-2 py-0.5 bg-white/5 text-white/30 text-[10px] rounded-md">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/30">
                        {channel?.name || 'Unknown channel'} • {batch.subjects.length} subjects
                      </p>
                      {batch.subjects.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {batch.subjects.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 bg-purple-500/10 text-purple-300 rounded-md text-[10px]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(batch)}
                        className="p-2 text-white/30 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this batch?')) deleteBatch(batch.id);
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
            {batches.length === 0 && (
              <div className="text-center py-16">
                <BookOpen className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-white/30">No batches yet. Add your first batch!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
