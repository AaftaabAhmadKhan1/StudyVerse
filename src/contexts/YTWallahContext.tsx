'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Channel, Batch, Video, Announcement, SiteSettings, generateId,
} from '@/data/types';
import {
  defaultSiteSettings, defaultChannels, defaultBatches, defaultVideos, defaultAnnouncements,
  getSiteSettings, saveSiteSettings,
  getChannels, saveChannels,
  getBatches, saveBatches,
  getVideos, saveVideos,
  getAnnouncements, saveAnnouncements,
} from '@/data/store';

interface YTWallahContextType {
  // Data
  channels: Channel[];
  batches: Batch[];
  videos: Video[];
  announcements: Announcement[];
  siteSettings: SiteSettings;

  // Channel CRUD
  addChannel: (channel: Omit<Channel, 'id' | 'createdAt'>) => void;
  updateChannel: (id: string, updates: Partial<Channel>) => void;
  deleteChannel: (id: string) => void;

  // Batch CRUD
  addBatch: (batch: Omit<Batch, 'id' | 'createdAt'>) => void;
  updateBatch: (id: string, updates: Partial<Batch>) => void;
  deleteBatch: (id: string) => void;

  // Video CRUD
  addVideo: (video: Omit<Video, 'id' | 'createdAt'>) => void;
  updateVideo: (id: string, updates: Partial<Video>) => void;
  deleteVideo: (id: string) => void;

  // Announcement CRUD
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'createdAt'>) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;

  // Settings
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  // Admin Auth
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, password: string) => boolean;
  adminLogout: () => void;

  // Reset
  resetToDefaults: () => void;
  mounted: boolean;
}

const YTWallahContext = createContext<YTWallahContextType | undefined>(undefined);

const ADMIN_EMAIL = 'admin@ytwallah.com';
const ADMIN_PASSWORD = 'admin2026';

export function YTWallahProvider({ children }: { children: ReactNode }) {
  const [channels, setChannels] = useState<Channel[]>(defaultChannels);
  const [batches, setBatches] = useState<Batch[]>(defaultBatches);
  const [videos, setVideos] = useState<Video[]>(defaultVideos);
  const [announcements, setAnnouncements] = useState<Announcement[]>(defaultAnnouncements);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    setChannels(getChannels());
    setBatches(getBatches());
    setVideos(getVideos());
    setAnnouncements(getAnnouncements());
    setSiteSettings(getSiteSettings());

    const auth = localStorage.getItem('yt-wallah-admin-auth');
    if (auth === 'true') setIsAdminAuthenticated(true);
  }, []);

  // Persist on change
  useEffect(() => { if (mounted) saveChannels(channels); }, [channels, mounted]);
  useEffect(() => { if (mounted) saveBatches(batches); }, [batches, mounted]);
  useEffect(() => { if (mounted) saveVideos(videos); }, [videos, mounted]);
  useEffect(() => { if (mounted) saveAnnouncements(announcements); }, [announcements, mounted]);

  // Channel CRUD
  const addChannel = (channel: Omit<Channel, 'id' | 'createdAt'>) => {
    setChannels(prev => [...prev, { ...channel, id: generateId(), createdAt: new Date().toISOString() } as Channel]);
  };
  const updateChannel = (id: string, updates: Partial<Channel>) => {
    setChannels(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };
  const deleteChannel = (id: string) => {
    setChannels(prev => prev.filter(c => c.id !== id));
  };

  // Batch CRUD
  const addBatch = (batch: Omit<Batch, 'id' | 'createdAt'>) => {
    setBatches(prev => [...prev, { ...batch, id: generateId(), createdAt: new Date().toISOString() } as Batch]);
  };
  const updateBatch = (id: string, updates: Partial<Batch>) => {
    setBatches(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };
  const deleteBatch = (id: string) => {
    setBatches(prev => prev.filter(b => b.id !== id));
  };

  // Video CRUD
  const addVideo = (video: Omit<Video, 'id' | 'createdAt'>) => {
    setVideos(prev => [...prev, { ...video, id: generateId(), createdAt: new Date().toISOString() } as Video]);
  };
  const updateVideo = (id: string, updates: Partial<Video>) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };
  const deleteVideo = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  // Announcement CRUD
  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'createdAt'>) => {
    setAnnouncements(prev => [...prev, { ...ann, id: generateId(), createdAt: new Date().toISOString() } as Announcement]);
  };
  const updateAnnouncement = (id: string, updates: Partial<Announcement>) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };
  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  // Settings
  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    const newSettings = { ...siteSettings, ...settings };
    setSiteSettings(newSettings);
    saveSiteSettings(newSettings);
  };

  // Admin Auth
  const adminLogin = (email: string, password: string): boolean => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('yt-wallah-admin-auth', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('yt-wallah-admin-auth');
  };

  // Reset all data
  const resetToDefaults = () => {
    setChannels(defaultChannels);
    setBatches(defaultBatches);
    setVideos(defaultVideos);
    setAnnouncements(defaultAnnouncements);
    setSiteSettings(defaultSiteSettings);
    saveChannels(defaultChannels);
    saveBatches(defaultBatches);
    saveVideos(defaultVideos);
    saveAnnouncements(defaultAnnouncements);
    saveSiteSettings(defaultSiteSettings);
  };

  return (
    <YTWallahContext.Provider value={{
      channels, batches, videos, announcements, siteSettings,
      addChannel, updateChannel, deleteChannel,
      addBatch, updateBatch, deleteBatch,
      addVideo, updateVideo, deleteVideo,
      addAnnouncement, updateAnnouncement, deleteAnnouncement,
      updateSiteSettings,
      isAdminAuthenticated, adminLogin, adminLogout,
      resetToDefaults, mounted,
    }}>
      {children}
    </YTWallahContext.Provider>
  );
}

export function useYTWallah() {
  const context = useContext(YTWallahContext);
  if (!context) throw new Error('useYTWallah must be used within YTWallahProvider');
  return context;
}
