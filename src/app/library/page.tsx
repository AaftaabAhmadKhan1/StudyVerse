'use client';

import { type ReactNode, useMemo, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Clock3, ExternalLink, Files, Heart, History, StickyNote } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useYTWallah } from '@/contexts/YTWallahContext';

type LibraryTab = 'saved' | 'history' | 'notes' | 'resources';

const BOARD_OPTIONS = ['CBSE', 'ICSE'] as const;
const CLASS_OPTIONS = ['9th', '10th', '11th', '12th'] as const;

export default function LibraryPage() {
  const { savedVideos, watchHistory, notes } = useAuth();
  const { siteSettings } = useYTWallah();
  const [activeTab, setActiveTab] = useState<LibraryTab>('saved');
  const [selectedBoard, setSelectedBoard] = useState<(typeof BOARD_OPTIONS)[number]>('CBSE');
  const [selectedClass, setSelectedClass] = useState<(typeof CLASS_OPTIONS)[number]>('10th');

  const filteredResources = useMemo(
    () =>
      (siteSettings.studyNotes || []).filter(
        (note) =>
          note.isActive && note.board === selectedBoard && note.classLevel === selectedClass
      ),
    [selectedBoard, selectedClass, siteSettings.studyNotes]
  );

  const tabs: Array<{ id: LibraryTab; label: string; icon: typeof Heart }> = [
    { id: 'saved', label: 'Saved Videos', icon: Heart },
    { id: 'history', label: 'Watch History', icon: History },
    { id: 'notes', label: 'My Notes', icon: StickyNote },
    { id: 'resources', label: 'Study Notes', icon: Files },
  ];

  return (
    <main className="min-h-screen bg-[#030014]">
      <Navigation />
      <div className="md:ml-52 lg:ml-60 px-4 py-8 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Library</h1>
            <p className="mt-2 text-sm text-white/40">
              Your saved videos, watch history, notes, and board-wise study resources.
            </p>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${
                    active
                      ? 'border-purple-400/40 bg-purple-500/15 text-white'
                      : 'border-white/10 bg-white/5 text-white/55 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === 'saved' && (
            <VideoGrid
              items={savedVideos.map((video) => ({
                href: `/watch/${video.youtubeVideoId}`,
                title: video.title,
                subtitle: video.channelName || 'Saved from player',
                meta: new Date(video.savedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                thumbnailUrl: video.thumbnailUrl,
              }))}
              emptyTitle="No saved videos yet"
              emptyCopy="Use the Save button in the player to keep videos here."
            />
          )}

          {activeTab === 'history' && (
            <VideoGrid
              items={watchHistory.map((video) => ({
                href: `/watch/${video.youtubeVideoId}`,
                title: video.title,
                subtitle: video.channelName || 'Recently watched',
                meta: new Date(video.watchedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                thumbnailUrl: video.thumbnailUrl,
              }))}
              emptyTitle="No watch history yet"
              emptyCopy="Start watching videos and your recent history will show up here."
            />
          )}

          {activeTab === 'notes' && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {notes.length > 0 ? (
                notes
                  .slice()
                  .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
                  .map((note) => (
                    <div
                      key={note.id}
                      className="rounded-2xl border border-purple-500/10 bg-[#0f0a1f]/70 p-5"
                    >
                      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-200">
                        <Clock3 className="h-3.5 w-3.5" />
                        {Math.floor(note.timestamp / 60)}:{String(note.timestamp % 60).padStart(2, '0')}
                      </div>
                      <p className="text-sm leading-relaxed text-white/80">{note.content}</p>
                      <Link
                        href={`/watch/${note.videoId}`}
                        className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-purple-300 hover:text-purple-200"
                      >
                        Open Video
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  ))
              ) : (
                <EmptyState
                  title="No notes yet"
                  copy="Your timestamped video notes will appear here once you start writing in the player."
                  icon={<StickyNote className="h-10 w-10 text-white/15" />}
                />
              )}
            </div>
          )}

          {activeTab === 'resources' && (
            <section>
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <select
                  value={selectedBoard}
                  onChange={(event) => setSelectedBoard(event.target.value as (typeof BOARD_OPTIONS)[number])}
                  className="rounded-xl border border-white/10 bg-[#0f0a1f] px-4 py-2 text-sm text-white"
                >
                  {BOARD_OPTIONS.map((board) => (
                    <option key={board} value={board}>
                      {board}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedClass}
                  onChange={(event) => setSelectedClass(event.target.value as (typeof CLASS_OPTIONS)[number])}
                  className="rounded-xl border border-white/10 bg-[#0f0a1f] px-4 py-2 text-sm text-white"
                >
                  {CLASS_OPTIONS.map((classLevel) => (
                    <option key={classLevel} value={classLevel}>
                      {classLevel}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl border border-cyan-400/10 bg-[#0f0a1f]/70 p-5 transition-colors hover:border-cyan-300/30"
                    >
                      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
                        <BookOpen className="h-3.5 w-3.5" />
                        {resource.board} • {resource.classLevel}
                      </div>
                      <h2 className="text-lg font-semibold text-white">{resource.title}</h2>
                      {resource.description ? (
                        <p className="mt-2 text-sm leading-relaxed text-white/50">
                          {resource.description}
                        </p>
                      ) : null}
                      <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-200">
                        Open {resource.format === 'drive' ? 'Drive Link' : 'PDF'}
                        <ExternalLink className="h-4 w-4" />
                      </p>
                    </a>
                  ))
                ) : (
                  <EmptyState
                    title="No study notes uploaded yet"
                    copy="Admin-uploaded board and class wise notes will show here."
                    icon={<Files className="h-10 w-10 text-white/15" />}
                  />
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

function VideoGrid({
  items,
  emptyTitle,
  emptyCopy,
}: {
  items: Array<{ href: string; title: string; subtitle: string; meta: string; thumbnailUrl: string }>;
  emptyTitle: string;
  emptyCopy: string;
}) {
  return items.length > 0 ? (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Link
          key={`${item.href}-${item.meta}`}
          href={item.href}
          className="overflow-hidden rounded-2xl border border-purple-500/10 bg-[#0f0a1f]/70 transition-colors hover:border-purple-400/25"
        >
          <div className="aspect-video bg-[#140d2b]">
            {item.thumbnailUrl ? (
              <img src={item.thumbnailUrl} alt={item.title} className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="p-4">
            <h2 className="line-clamp-2 text-sm font-semibold text-white">{item.title}</h2>
            <p className="mt-2 text-xs text-white/45">{item.subtitle}</p>
            <p className="mt-1 text-xs text-white/30">{item.meta}</p>
          </div>
        </Link>
      ))}
    </div>
  ) : (
    <EmptyState
      title={emptyTitle}
      copy={emptyCopy}
      icon={<BookOpen className="h-10 w-10 text-white/15" />}
    />
  );
}

function EmptyState({ title, copy, icon }: { title: string; copy: string; icon: ReactNode }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-center">
      {icon}
      <h2 className="mt-4 text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-white/40">{copy}</p>
    </div>
  );
}
