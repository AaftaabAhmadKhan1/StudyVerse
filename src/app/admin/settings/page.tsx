'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useYTWallah } from '@/contexts/YTWallahContext';
import {
  Settings,
  Save,
  RotateCcw,
  Globe,
  Palette,
  MessageSquare,
  Link2,
  PlayCircle,
  Plus,
  Trash2,
  Files,
} from 'lucide-react';

const BOARD_OPTIONS = ['CBSE', 'ICSE'] as const;
const CLASS_OPTIONS = ['9th', '10th', '11th', '12th'] as const;

export default function AdminSettingsPage() {
  const router = useRouter();
  const { isAdminAuthenticated, mounted, siteSettings, updateSiteSettings } = useYTWallah();
  const [form, setForm] = useState(siteSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (mounted && !isAdminAuthenticated) router.push('/admin/login');
  }, [mounted, isAdminAuthenticated, router]);

  useEffect(() => {
    setForm(siteSettings);
  }, [siteSettings]);

  if (!mounted || !isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="text-white/20 animate-pulse">Loading...</div>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('Reset all settings to defaults?')) {
      const defaults = {
        siteName: 'PW StudyVerse',
        siteTagline: 'Your Gateway to Physics Wallah Universe',
        siteDescription: 'Watch PW lectures ad-free with notes, organized by batch and subject.',
        logoUrl: '',
        primaryColor: '#7c3aed',
        accentColor: '#ec4899',
        footerText: '© 2026 PW StudyVerse. Uses YouTube embeds and YouTube API Services.',
        socialLinks: { youtube: '', telegram: '', twitter: '', instagram: '', website: '' },
        maintenanceMode: false,
        welcomeMessage: 'Welcome to PW StudyVerse — your focused PW learning hub!',
        // preserve existing API key even though it's not editable
        youtubeApiKey: form.youtubeApiKey,
        battleOfBrainsDemoVideoId: '',
        battlePromoVideos: [],
        studyNotes: [],
      };
      setForm(defaults);
      updateSiteSettings(defaults);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014]">
      <AdminSidebar />
      <div className="md:ml-56 lg:ml-64 pt-16 md:pt-0">
        <div className="px-6 py-8 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Settings className="w-7 h-7 text-purple-400" /> Settings
            </h1>
            <p className="text-white/40 text-sm mt-1">Configure site-wide settings</p>
          </motion.div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* General */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-[#0f0a1f]/60 border border-purple-500/10 rounded-2xl p-6 space-y-4"
            >
              <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-400" /> General
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-white/50 block mb-1">Site Name</label>
                  <input
                    value={form.siteName}
                    onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/50 block mb-1">Tagline</label>
                  <input
                    value={form.siteTagline}
                    onChange={(e) => setForm({ ...form, siteTagline: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-white/50 block mb-1">
                    Description
                  </label>
                  <textarea
                    value={form.siteDescription}
                    onChange={(e) => setForm({ ...form, siteDescription: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30 resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/50 block mb-1">Logo URL</label>
                  <input
                    value={form.logoUrl}
                    onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/50 block mb-1">
                    Footer Text
                  </label>
                  <input
                    value={form.footerText}
                    onChange={(e) => setForm({ ...form, footerText: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30"
                  />
                </div>
              </div>
            </motion.div>

            {/* Appearance */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0f0a1f]/60 border border-purple-500/10 rounded-2xl p-6 space-y-4"
            >
              <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                <Palette className="w-4 h-4 text-pink-400" /> Appearance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-white/50 block mb-1">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={form.primaryColor}
                      onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-purple-500/10 bg-transparent"
                    />
                    <input
                      value={form.primaryColor}
                      onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                      className="flex-1 px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-white/50 block mb-1">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={form.accentColor}
                      onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-purple-500/10 bg-transparent"
                    />
                    <input
                      value={form.accentColor}
                      onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                      className="flex-1 px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30 font-mono"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Welcome */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-[#0f0a1f]/60 border border-purple-500/10 rounded-2xl p-6 space-y-4"
            >
              <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-400" /> Welcome & Maintenance
              </h2>
              <div>
                <label className="text-xs font-medium text-white/50 block mb-1">
                  Welcome Message
                </label>
                <textarea
                  value={form.welcomeMessage}
                  onChange={(e) => setForm({ ...form, welcomeMessage: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30 resize-none"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.maintenanceMode}
                  onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })}
                  className="rounded border-purple-500/30 bg-[#1a1035]"
                />
                <span className="text-sm text-white/60">Maintenance Mode</span>
                {form.maintenanceMode && (
                  <span className="text-xs text-red-400 ml-2">
                    (Site will show maintenance page)
                  </span>
                )}
              </label>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0f0a1f]/60 border border-purple-500/10 rounded-2xl p-6 space-y-4"
            >
              <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-cyan-400" /> Battle Of Brain
              </h2>
              <div>
                <label className="text-xs font-medium text-white/50 block mb-1">
                  Demo Video YouTube ID or URL
                </label>
                <input
                  value={form.battleOfBrainsDemoVideoId}
                  onChange={(e) =>
                    setForm({ ...form, battleOfBrainsDemoVideoId: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30"
                  placeholder="e.g. dQw4w9WgXcQ or full YouTube link"
                />
                <p className="mt-2 text-xs text-white/35">
                  This video opens when the user clicks `Watch Demo` on the Battle Of Brain home
                  page.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="bg-[#0f0a1f]/60 border border-purple-500/10 rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-pink-400" /> Class-wise Live Battle Promo Videos
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      battlePromoVideos: [
                        ...(form.battlePromoVideos || []),
                        {
                          id: `promo-${Date.now()}`,
                          board: 'CBSE',
                          classLevel: '10th',
                          title: '',
                          videoUrl: '',
                          isActive: true,
                          createdAt: new Date().toISOString(),
                        },
                      ],
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70"
                >
                  <Plus className="w-4 h-4" />
                  Add Promo
                </button>
              </div>

              <div className="space-y-4">
                {(form.battlePromoVideos || []).map((promo, index) => (
                  <div key={promo.id} className="rounded-2xl border border-white/8 bg-[#1a1035]/70 p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <input
                        value={promo.title}
                        onChange={(e) => {
                          const next = [...(form.battlePromoVideos || [])];
                          next[index] = { ...promo, title: e.target.value };
                          setForm({ ...form, battlePromoVideos: next });
                        }}
                        className="px-4 py-2.5 bg-[#100a22] border border-purple-500/10 rounded-xl text-white text-sm"
                        placeholder="Promo title"
                      />
                      <select
                        value={promo.board}
                        onChange={(e) => {
                          const next = [...(form.battlePromoVideos || [])];
                          next[index] = { ...promo, board: e.target.value as 'CBSE' | 'ICSE' };
                          setForm({ ...form, battlePromoVideos: next });
                        }}
                        className="px-4 py-2.5 bg-[#100a22] border border-purple-500/10 rounded-xl text-white text-sm"
                      >
                        {BOARD_OPTIONS.map((board) => (
                          <option key={board} value={board}>
                            {board}
                          </option>
                        ))}
                      </select>
                      <select
                        value={promo.classLevel}
                        onChange={(e) => {
                          const next = [...(form.battlePromoVideos || [])];
                          next[index] = { ...promo, classLevel: e.target.value as '9th' | '10th' | '11th' | '12th' };
                          setForm({ ...form, battlePromoVideos: next });
                        }}
                        className="px-4 py-2.5 bg-[#100a22] border border-purple-500/10 rounded-xl text-white text-sm"
                      >
                        {CLASS_OPTIONS.map((classLevel) => (
                          <option key={classLevel} value={classLevel}>
                            {classLevel}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            battlePromoVideos: (form.battlePromoVideos || []).filter((item) => item.id !== promo.id),
                          })
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                    <input
                      value={promo.videoUrl}
                      onChange={(e) => {
                        const next = [...(form.battlePromoVideos || [])];
                        next[index] = { ...promo, videoUrl: e.target.value };
                        setForm({ ...form, battlePromoVideos: next });
                      }}
                      className="w-full px-4 py-2.5 bg-[#100a22] border border-purple-500/10 rounded-xl text-white text-sm"
                      placeholder="YouTube URL or video ID"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.23 }}
              className="bg-[#0f0a1f]/60 border border-purple-500/10 rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                  <Files className="w-4 h-4 text-cyan-400" /> Board and Class Wise Notes
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      studyNotes: [
                        ...(form.studyNotes || []),
                        {
                          id: `note-${Date.now()}`,
                          title: '',
                          board: 'CBSE',
                          classLevel: '10th',
                          format: 'pdf',
                          url: '',
                          thumbnailUrl: '',
                          description: '',
                          isActive: true,
                          createdAt: new Date().toISOString(),
                        },
                      ],
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70"
                >
                  <Plus className="w-4 h-4" />
                  Add Note
                </button>
              </div>

              <div className="space-y-4">
                {(form.studyNotes || []).map((note, index) => (
                  <div key={note.id} className="rounded-2xl border border-white/8 bg-[#1a1035]/70 p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      <input
                        value={note.title}
                        onChange={(e) => {
                          const next = [...(form.studyNotes || [])];
                          next[index] = { ...note, title: e.target.value };
                          setForm({ ...form, studyNotes: next });
                        }}
                        className="px-4 py-2.5 bg-[#100a22] border border-purple-500/10 rounded-xl text-white text-sm"
                        placeholder="Note title"
                      />
                      <select
                        value={note.board}
                        onChange={(e) => {
                          const next = [...(form.studyNotes || [])];
                          next[index] = { ...note, board: e.target.value as 'CBSE' | 'ICSE' };
                          setForm({ ...form, studyNotes: next });
                        }}
                        className="px-4 py-2.5 bg-[#100a22] border border-purple-500/10 rounded-xl text-white text-sm"
                      >
                        {BOARD_OPTIONS.map((board) => (
                          <option key={board} value={board}>
                            {board}
                          </option>
                        ))}
                      </select>
                      <select
                        value={note.classLevel}
                        onChange={(e) => {
                          const next = [...(form.studyNotes || [])];
                          next[index] = { ...note, classLevel: e.target.value as '9th' | '10th' | '11th' | '12th' };
                          setForm({ ...form, studyNotes: next });
                        }}
                        className="px-4 py-2.5 bg-[#100a22] border border-purple-500/10 rounded-xl text-white text-sm"
                      >
                        {CLASS_OPTIONS.map((classLevel) => (
                          <option key={classLevel} value={classLevel}>
                            {classLevel}
                          </option>
                        ))}
                      </select>
                      <select
                        value={note.format}
                        onChange={(e) => {
                          const next = [...(form.studyNotes || [])];
                          next[index] = { ...note, format: e.target.value as 'pdf' | 'drive' };
                          setForm({ ...form, studyNotes: next });
                        }}
                        className="px-4 py-2.5 bg-[#100a22] border border-purple-500/10 rounded-xl text-white text-sm"
                      >
                        <option value="pdf">PDF</option>
                        <option value="drive">Google Drive</option>
                      </select>
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            studyNotes: (form.studyNotes || []).filter((item) => item.id !== note.id),
                          })
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                    <input
                      value={note.url}
                      onChange={(e) => {
                        const next = [...(form.studyNotes || [])];
                        next[index] = { ...note, url: e.target.value };
                        setForm({ ...form, studyNotes: next });
                      }}
                      className="w-full px-4 py-2.5 bg-[#100a22] border border-purple-500/10 rounded-xl text-white text-sm"
                      placeholder="PDF URL or Google Drive link"
                    />
                    <input
                      value={note.description || ''}
                      onChange={(e) => {
                        const next = [...(form.studyNotes || [])];
                        next[index] = { ...note, description: e.target.value };
                        setForm({ ...form, studyNotes: next });
                      }}
                      className="w-full px-4 py-2.5 bg-[#100a22] border border-purple-500/10 rounded-xl text-white text-sm"
                      placeholder="Short description"
                    />
                  </div>
                ))}
              </div>
            </motion.div>


            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-[#0f0a1f]/60 border border-purple-500/10 rounded-2xl p-6 space-y-4"
            >
              <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-blue-400" /> Social Links
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.keys(form.socialLinks) as (keyof typeof form.socialLinks)[]).map((key) => (
                  <div key={key}>
                    <label className="text-xs font-medium text-white/50 block mb-1 capitalize">
                      {key}
                    </label>
                    <input
                      value={form.socialLinks[key]}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          socialLinks: { ...form.socialLinks, [key]: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 bg-[#1a1035] border border-purple-500/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/30"
                      placeholder={`https://${key}.com/...`}
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex items-center gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/20"
              >
                <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Settings'}
              </motion.button>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/60 text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Reset to Defaults
              </button>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  );
}
