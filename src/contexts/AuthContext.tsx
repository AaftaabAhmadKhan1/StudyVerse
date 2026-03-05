'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Note, generateId } from '@/data/types';

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

  // Notes (localStorage, tied to user email)
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  getNotesForVideo: (videoId: string) => Note[];

  mounted: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [notes, setNotes] = useState<Note[]>([]);
  const [mounted, setMounted] = useState(false);
  const [ytUserInfo, setYTUserInfo] = useState<YTUserInfo | null>(null);
  const [ytLoading, setYTLoading] = useState(false);

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
    // Load notes
    try {
      const storedNotes = localStorage.getItem('yt-wallah-notes');
      if (storedNotes) setNotes(JSON.parse(storedNotes));
    } catch { /* ignore */ }
  }, [fetchSession]);

  // Re-fetch session on window focus
  useEffect(() => {
    const onFocus = () => fetchSession();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchSession]);

  // Persist notes
  useEffect(() => {
    if (mounted) localStorage.setItem('yt-wallah-notes', JSON.stringify(notes));
  }, [notes, mounted]);

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

  const user = session?.user || null;
  const isAuthenticated = status === 'authenticated' && !!user;
  const userId = user?.email || 'anonymous';

  const handleSignIn = () => {
    // Redirect to NextAuth Google sign in
    window.location.href = '/api/auth/signin/google';
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

  // Notes CRUD
  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!isAuthenticated) return;
    const newNote: Note = {
      ...note, id: generateId(), userId,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [...prev, newNote]);
  };

  const updateNote = (id: string, content: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, content, updatedAt: new Date().toISOString() } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const getNotesForVideo = (videoId: string): Note[] => {
    if (!isAuthenticated) return [];
    return notes.filter(n => n.videoId === videoId && n.userId === userId);
  };

  return (
    <AuthContext.Provider value={{
      session, status, isAuthenticated, user,
      signIn: handleSignIn, signOut: handleSignOut,
      ytUserInfo, ytLoading, fetchYTUserInfo,
      notes, addNote, updateNote, deleteNote, getNotesForVideo,
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