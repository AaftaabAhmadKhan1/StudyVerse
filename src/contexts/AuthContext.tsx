'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Note, generateId } from '@/data/types';
import { incrementCompactCount } from '@/lib/subscriptions';

// ---------- YouTube user types ----------
interface YTSubscription {
  channelId: string;
  title: string;
  thumbnailUrl: string;
}

interface YTUserInfo {
  subscriptions: YTSubscription[];
  myChannel: { id: string; name: string; thumbnailUrl: string; subscriberCount: string } | null;
  subscriptionCount: number;
}

// ---------- Session user (from NextAuth) ----------
interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Session {
  user?: SessionUser;
  accessToken?: string;
  expires?: string;
}

interface SavedVideo {
  id: string;
  youtubeVideoId: string;
  title: string;
  thumbnailUrl: string;
  channelName?: string;
  savedAt: string;
}

interface WatchHistoryItem {
  id: string;
  youtubeVideoId: string;
  title: string;
  thumbnailUrl: string;
  channelName?: string;
  watchedAt: string;
}

interface AuthContextType {
  // Session (Google OAuth via NextAuth)
  session: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  isAuthenticated: boolean;
  user: SessionUser | null;
  signIn: () => void;
  signOut: () => void;

  // YouTube user data
  ytUserInfo: YTUserInfo | null;
  ytLoading: boolean;
  fetchYTUserInfo: () => Promise<void>;
  isSubscribedToChannel: (channelId: string) => boolean;
  subscribeToChannel: (
    channelId: string
  ) => Promise<{ ok: boolean; error?: string; requiresAuth?: boolean; alreadySubscribed?: boolean }>;
  getDisplaySubscriberCount: (channelId: string, baseCount: string) => string;

  // Library
  savedVideos: SavedVideo[];
  watchHistory: WatchHistoryItem[];
  toggleSavedVideo: (video: Omit<SavedVideo, 'savedAt'>) => void;
  isVideoSaved: (youtubeVideoId: string) => boolean;
  addWatchHistory: (video: Omit<WatchHistoryItem, 'watchedAt'>) => void;

  // Notes (localStorage, tied to user email)
  notes: Note[];
  handwrittenImages: Record<string, string>;
  addNote: (note: Omit<Note, 'createdAt' | 'updatedAt' | 'userId'> & { id?: string }) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  getNotesForVideo: (videoId: string) => Note[];
  saveHandwrittenImage: (noteId: string, dataUrl: string) => void;
  getHandwrittenForNote: (noteId: string) => string | undefined;
  deleteHandwrittenImage: (noteId: string) => void;

  mounted: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [notes, setNotes] = useState<Note[]>([]);
  const [handwrittenImages, setHandwrittenImages] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);
  const [ytUserInfo, setYTUserInfo] = useState<YTUserInfo | null>(null);
  const [ytLoading, setYTLoading] = useState(false);
  const [anonId, setAnonId] = useState<string | null>(null);
  const [subscriptionOverrides, setSubscriptionOverrides] = useState<Record<string, boolean>>({});
  const [savedVideos, setSavedVideos] = useState<SavedVideo[]>([]);
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const user = session?.user || null;
  const isAuthenticated = status === 'authenticated' && !!user;
  const userId = user?.email || anonId || 'anonymous';

  // Fetch NextAuth session
  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      if (data?.user) {
        setSession(data);
        setStatus('authenticated');
      } else {
        setSession(null);
        setStatus('unauthenticated');
      }
    } catch {
      setSession(null);
      setStatus('unauthenticated');
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchSession();
    // Load notes and handwritten images
    try {
      const storedNotes = localStorage.getItem('yt-wallah-notes');
      if (storedNotes) setNotes(JSON.parse(storedNotes));
      const storedHand = localStorage.getItem('yt-wallah-handwritten');
      if (storedHand) setHandwrittenImages(JSON.parse(storedHand));
      const storedSavedVideos = localStorage.getItem('yt-wallah-saved-videos');
      if (storedSavedVideos) setSavedVideos(JSON.parse(storedSavedVideos));
      const storedWatchHistory = localStorage.getItem('yt-wallah-watch-history');
      if (storedWatchHistory) setWatchHistory(JSON.parse(storedWatchHistory));
      // Ensure we have an anonymous id for local-only notes
      let storedAnon = localStorage.getItem('yt-wallah-anon-id');
      if (!storedAnon) {
        storedAnon = generateId();
        localStorage.setItem('yt-wallah-anon-id', storedAnon);
      }
      setAnonId(storedAnon);
    } catch { /* ignore */ }
  }, [fetchSession]);

  useEffect(() => {
    if (!mounted || !userId) return;

    try {
      const stored = localStorage.getItem(`yt-wallah-subscription-overrides:${userId}`);
      setSubscriptionOverrides(stored ? JSON.parse(stored) : {});
    } catch {
      setSubscriptionOverrides({});
    }
  }, [mounted, userId]);

  // Re-fetch session on window focus
  useEffect(() => {
    const onFocus = () => fetchSession();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchSession]);

  // Persist notes
  useEffect(() => {
    if (mounted) localStorage.setItem('yt-wallah-notes', JSON.stringify(notes));
    if (mounted) localStorage.setItem('yt-wallah-handwritten', JSON.stringify(handwrittenImages));
    if (mounted) localStorage.setItem('yt-wallah-saved-videos', JSON.stringify(savedVideos));
    if (mounted) localStorage.setItem('yt-wallah-watch-history', JSON.stringify(watchHistory));
  }, [notes, handwrittenImages, savedVideos, watchHistory, mounted]);

  useEffect(() => {
    if (!mounted || !userId) return;
    localStorage.setItem(
      `yt-wallah-subscription-overrides:${userId}`,
      JSON.stringify(subscriptionOverrides)
    );
  }, [mounted, subscriptionOverrides, userId]);

  // Fetch YouTube user info (subscriptions, channel)
  const fetchYTUserInfo = useCallback(async () => {
    if (!session?.accessToken) return;
    setYTLoading(true);
    try {
      const res = await fetch('/api/youtube/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: session.accessToken }),
      });
      const data = await res.json();
      if (res.ok) setYTUserInfo(data);
    } catch { /* ignore */ }
    setYTLoading(false);
  }, [session?.accessToken]);

  // Auto-fetch YT info when authenticated
  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      fetchYTUserInfo();
    }
  }, [status, session?.accessToken, fetchYTUserInfo]);

  const handleSignIn = () => {
    window.location.href = '/login';
  };

  const handleSignOut = async () => {
    // Call NextAuth signout
    try {
      const res = await fetch('/api/auth/csrf');
      const { csrfToken } = await res.json();
      await fetch('/api/auth/signout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `csrfToken=${csrfToken}`,
      });
    } catch { /* ignore */ }
    setSession(null);
    setStatus('unauthenticated');
    setYTUserInfo(null);
    window.location.href = '/';
  };

  const isSubscribedToChannel = useCallback(
    (channelId: string) => {
      if (subscriptionOverrides[channelId]) return true;
      return !!ytUserInfo?.subscriptions.some((subscription) => subscription.channelId === channelId);
    },
    [subscriptionOverrides, ytUserInfo]
  );

  const subscribeToChannel = useCallback(
    async (channelId: string) => {
      if (!session?.accessToken) {
        return { ok: false, requiresAuth: true };
      }

      if (isSubscribedToChannel(channelId)) {
        return { ok: true, alreadySubscribed: true };
      }

      try {
        const res = await fetch('/api/youtube/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: session.accessToken, channelId }),
        });
        const data = await res.json();

        if (!res.ok) {
          return {
            ok: false,
            error: data?.error || 'Failed to subscribe on YouTube',
          };
        }

        if (!data?.alreadySubscribed) {
          setSubscriptionOverrides((prev) => ({ ...prev, [channelId]: true }));
        }

        fetchYTUserInfo().catch(() => undefined);

        return {
          ok: true,
          alreadySubscribed: !!data?.alreadySubscribed,
        };
      } catch (error: unknown) {
        return {
          ok: false,
          error: error instanceof Error ? error.message : 'Failed to subscribe on YouTube',
        };
      }
    },
    [fetchYTUserInfo, isSubscribedToChannel, session?.accessToken]
  );

  const getDisplaySubscriberCount = useCallback(
    (channelId: string, baseCount: string) => {
      if (!subscriptionOverrides[channelId]) return baseCount;
      return incrementCompactCount(baseCount);
    },
    [subscriptionOverrides]
  );

  const isVideoSaved = useCallback(
    (youtubeVideoId: string) => savedVideos.some((video) => video.youtubeVideoId === youtubeVideoId),
    [savedVideos]
  );

  const toggleSavedVideo = useCallback((video: Omit<SavedVideo, 'savedAt'>) => {
    setSavedVideos((prev) => {
      const existing = prev.find((item) => item.youtubeVideoId === video.youtubeVideoId);
      if (existing) {
        return prev.filter((item) => item.youtubeVideoId !== video.youtubeVideoId);
      }
      return [{ ...video, savedAt: new Date().toISOString() }, ...prev];
    });
  }, []);

  const addWatchHistory = useCallback((video: Omit<WatchHistoryItem, 'watchedAt'>) => {
    setWatchHistory((prev) => {
      const next = prev.filter((item) => item.youtubeVideoId !== video.youtubeVideoId);
      return [{ ...video, watchedAt: new Date().toISOString() }, ...next].slice(0, 100);
    });
  }, []);

  // Notes CRUD
  const addNote = (note: Omit<Note, 'createdAt' | 'updatedAt' | 'userId'> & { id?: string }) => {
    const newNote: Note = {
      ...note,
      id: note.id || generateId(),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Note;
    console.debug('addNote:', newNote);
    setNotes((prev) => [...prev, newNote]);
  };

  const updateNote = (id: string, content: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, content, updatedAt: new Date().toISOString() } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const saveHandwrittenImage = (noteId: string, dataUrl: string) => {
    setHandwrittenImages((prev) => ({ ...prev, [noteId]: dataUrl }));
  };

  const getHandwrittenForNote = (noteId: string) => handwrittenImages[noteId];

  const deleteHandwrittenImage = (noteId: string) => {
    setHandwrittenImages((prev) => {
      const next = { ...prev };
      delete next[noteId];
      return next;
    });
  };

  const getNotesForVideo = (videoId: string): Note[] => {
    return notes.filter((n) => n.videoId === videoId && n.userId === userId);
  };

  return (
    <AuthContext.Provider value={{
      session, status, isAuthenticated, user,
      signIn: handleSignIn, signOut: handleSignOut,
      ytUserInfo, ytLoading, fetchYTUserInfo, isSubscribedToChannel, subscribeToChannel, getDisplaySubscriberCount,
      savedVideos, watchHistory, toggleSavedVideo, isVideoSaved, addWatchHistory,
      notes, handwrittenImages, addNote, updateNote, deleteNote, getNotesForVideo, saveHandwrittenImage, getHandwrittenForNote, deleteHandwrittenImage,
      mounted,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
