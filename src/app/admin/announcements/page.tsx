'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useYTWallah } from '@/contexts/YTWallahContext';
import {
  Bell,
  Plus,
  Trash2,
  Edit,
  X,
  Check,
  AlertTriangle,
  Info,
  AlertCircle,
  Megaphone,
} from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const router = useRouter();
  const {
    isAdminAuthenticated,
    mounted,
    announcements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  } = useYTWallah();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    isActive: true,
    expiresAt: '',
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
      title: '',
      content: '',
      priority: 'medium',
      isActive: true,
      expiresAt: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      type: 'global' as const,
      expiresAt: form.expiresAt || undefined,
    };
    if (editingId) {
      updateAnnouncement(editingId, payload);
    } else {
      addAnnouncement(payload);
    }
    resetForm();
  };

  const handleEdit = (ann: (typeof announcements)[0]) => {
    setForm({
      title: ann.title,
      content: ann.content,
      priority: ann.priority,
      isActive: ann.isActive,
      expiresAt: ann.expiresAt ? new Date(ann.expiresAt).toISOString().slice(0, 16) : '',
    });
    setEditingId(ann.id);
    setShowForm(true);
  };

  const priorityColors: Record<string, string> = {
    low: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    urgent: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  const priorityIcon = (p: string) => {
    if (p === 'urgent') return <AlertTriangle className="w-3.5 h-3.5" />;
    if (p === 'high') return <AlertCircle className="w-3.5 h-3.5" />;
    if (p === 'medium') return <Info className="w-3.5 h-3.5" />;
    return <Bell className="w-3.5 h-3.5" />;
  };

  return (
    <div className="min-h-screen bg-[#030014]">
      <AdminSidebar />
      <div className="md:ml-56 lg:ml-64 pt-16 md:pt-0">
        <div className="px-6 py-8 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Megaphone className="w-7 h-7 text-yellow-400" /> Announcements
              </h1>
              <p className="text-white/40 text-sm mt-1">
                Manage global announcements for the announcements page
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
              <Plus className="w-4 h-4" /> Add Announcement
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
                      {editingId ? 'Edit Announcement' : 'New Announcement'}
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
                        placeholder="Announcement title"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-white/50 block mb-1">
                        Content *
                      </label>
                      <textarea
                        required
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30 resize-none"
                        placeholder="Announcement content..."
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/50 block mb-1">
                        Priority
                      </label>
                      <select
                        value={form.priority}
                        onChange={(e) =>
                          setForm({ ...form, priority: e.target.value as typeof form.priority })
                        }
                        className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/50 block mb-1">
                        Expires At (optional)
                      </label>
                      <input
                        type="datetime-local"
                        value={form.expiresAt}
                        onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="rounded border-purple-500/30 bg-[#1a1035]"
                    />
                    <span className="text-sm text-white/60">Active</span>
                  </label>
                  <div className="flex items-center gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white text-sm font-semibold flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" /> {editingId ? 'Update' : 'Create'} Announcement
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
            {announcements.map((ann, i) => {
              return (
                <motion.div
                  key={ann.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-[#0f0a1f]/60 border border-purple-500/10 rounded-xl p-4 hover:border-purple-500/20 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${priorityColors[ann.priority]}`}
                    >
                      {priorityIcon(ann.priority)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-white">{ann.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] border ${priorityColors[ann.priority]}`}
                        >
                          {ann.priority}
                        </span>
                        <span className="px-2 py-0.5 bg-white/5 text-white/30 rounded-md text-[10px]">
                          Global
                        </span>
                        {!ann.isActive && (
                          <span className="px-2 py-0.5 bg-white/5 text-white/20 rounded-md text-[10px]">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/40 mt-1 line-clamp-2">{ann.content}</p>
                      {ann.expiresAt && (
                        <p className="text-[10px] text-white/20 mt-1">
                          Expires: {new Date(ann.expiresAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(ann)}
                        className="p-2 text-white/30 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this announcement?')) deleteAnnouncement(ann.id);
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
            {announcements.length === 0 && (
              <div className="text-center py-16">
                <Megaphone className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-white/30">No announcements yet. Create your first!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
