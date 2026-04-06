'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useYTWallah } from '@/contexts/YTWallahContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Files, Plus, Trash2, Save, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const BOARD_OPTIONS = ['CBSE', 'ICSE'] as const;
const CLASS_OPTIONS = ['9th', '10th', '11th', '12th'] as const;

export default function AdminStudyNotesPage() {
  const router = useRouter();
  const { isAdminAuthenticated, mounted, siteSettings, updateSiteSettings } = useYTWallah();
  
  const [notes, setNotes] = useState(siteSettings.studyNotes || []);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (mounted && !isAdminAuthenticated) router.push('/admin/login');
  }, [mounted, isAdminAuthenticated, router]);

  useEffect(() => {
    setNotes(siteSettings.studyNotes || []);
  }, [siteSettings]);

  const handleSave = () => {
    updateSiteSettings({
      ...siteSettings,
      studyNotes: notes,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addNote = () => {
    setNotes([
      {
        id: `note-${Date.now()}`,
        title: '',
        board: 'CBSE',
        classLevel: '10th',
        format: 'pdf',
        url: '',
        description: '',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      ...notes,
    ]);
  };

  const updateNote = (index: number, updates: any) => {
    const next = [...notes];
    next[index] = { ...next[index], ...updates };
    setNotes(next);
  };

  const removeNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  if (!mounted || !isAdminAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-[#030014]">
      <AdminSidebar />
      <div className="flex-1 md:pl-64">
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0520]/80 p-6 rounded-3xl border border-purple-500/10 backdrop-blur-xl">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Files className="w-6 h-6 text-purple-400" />
                Library Study Notes
              </h1>
              <p className="text-sm text-purple-300/60 mt-1">
                Manage the notes and resources displayed in the student Library. Note: these changes apply globally to all users.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={addNote}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-xl shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Note
              </button>
              <button
                onClick={handleSave}
                disabled={saved}
                className={`px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
                  saved
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-white/10 hover:bg-white/15 text-white border border-white/5'
                }`}
              >
                <Save className="w-4 h-4" />
                {saved ? 'Saved Successfully!' : 'Save All Changes'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {notes.length === 0 ? (
              <div className="text-center py-16 bg-[#0a0520]/40 rounded-3xl border border-purple-500/10 backdrop-blur-sm">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                  <FileText className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No notes available</h3>
                <p className="text-white/40 mb-6">Create your first study note to display it in the library.</p>
                <button
                  onClick={addNote}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl shadow-lg shadow-purple-500/25 inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add First Note
                </button>
              </div>
            ) : (
              notes.map((note, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={note.id}
                  className="rounded-2xl border border-white/10 bg-[#150d30]/60 p-5 space-y-4 shadow-lg"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4">
                      <label className="block text-xs font-semibold text-purple-300/80 mb-1">Title</label>
                      <input
                        value={note.title}
                        onChange={(e) => updateNote(index, { title: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#0a0520]/80 border border-purple-500/20 focus:border-purple-500/50 rounded-xl text-white text-sm outline-none transition-all"
                        placeholder="e.g., Chapter 1 Science Complete Notes"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-purple-300/80 mb-1">Board</label>
                      <select
                        value={note.board}
                        onChange={(e) => updateNote(index, { board: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#0a0520]/80 border border-purple-500/20 focus:border-purple-500/50 rounded-xl text-white text-sm outline-none transition-all"
                      >
                        {BOARD_OPTIONS.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-purple-300/80 mb-1">Class</label>
                      <select
                        value={note.classLevel}
                        onChange={(e) => updateNote(index, { classLevel: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#0a0520]/80 border border-purple-500/20 focus:border-purple-500/50 rounded-xl text-white text-sm outline-none transition-all"
                      >
                        {CLASS_OPTIONS.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-purple-300/80 mb-1">Format</label>
                      <select
                        value={note.format}
                        onChange={(e) => updateNote(index, { format: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#0a0520]/80 border border-purple-500/20 focus:border-purple-500/50 rounded-xl text-white text-sm outline-none transition-all"
                      >
                        <option value="pdf">Direct PDF Link</option>
                        <option value="drive">Google Drive</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 flex items-end">
                      <button
                        type="button"
                        onClick={() => removeNote(note.id)}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 hover:border-red-500/40 bg-red-500/10 hover:bg-red-500/20 p-2.5 text-sm text-red-300 transition-all font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove Note
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-purple-300/80 mb-1">File URL</label>
                      <input
                        value={note.url}
                        onChange={(e) => updateNote(index, { url: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#0a0520]/80 border border-purple-500/20 focus:border-purple-500/50 rounded-xl text-white text-sm outline-none transition-all"
                        placeholder="https://drive.google.com/... or https://.../file.pdf"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-purple-300/80 mb-1">Short Description (Optional)</label>
                      <input
                        value={note.description || ''}
                        onChange={(e) => updateNote(index, { description: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#0a0520]/80 border border-purple-500/20 focus:border-purple-500/50 rounded-xl text-white text-sm outline-none transition-all"
                        placeholder="e.g., Covers Newton's Laws and gravitation..."
                      />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}