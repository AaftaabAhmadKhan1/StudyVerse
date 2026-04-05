'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { Channel, Batch, Video, Announcement, SiteSettings } from '@/data/types';
import {
  defaultSiteSettings,
  defaultChannels,
  defaultBatches,
  defaultVideos,
  defaultAnnouncements,
  getAnnouncements,
  getBatches,
  saveChannels,
  saveAnnouncements,
  saveBatches,
  getSiteSettings,
  getChannels,
  getMyChannelIds,
  getVideos,
  saveMyChannelIds,
  saveSiteSettings,
  saveVideos,
} from '@/data/store';

// ── API helpers ───────────────────────────────────────
async function api<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

interface YTWallahContextType {
  // Data
  channels: Channel[];
  myChannels: Channel[];
  myChannelIds: string[];
  batches: Batch[];
  videos: Video[];
  announcements: Announcement[];
  siteSettings: SiteSettings;

  // Channel CRUD
  addChannel: (channel: Omit<Channel, 'id' | 'createdAt'>) => Channel;
  addChannelToMyChannels: (
    channel: Omit<Channel, 'id' | 'createdAt'>
  ) => { status: 'added' | 'already_added'; channel: Channel };
  saveChannelToMyChannels: (channelId: string) => 'added' | 'already_added';
  removeChannelFromMyChannels: (channelId: string) => void;
  isChannelInMyChannels: (channelId: string) => boolean;
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

function sanitizeLegacyBranding(settings: SiteSettings): SiteSettings {
  const replaceLegacy = (value: string) =>
    value
      .replace(/YT Wallah/g, 'PW StudyVerse')
      .replace(/yt wallah/g, 'PW StudyVerse')
      .replace(/Your one-stop destination for Physics Wallah content!?/gi, 'your focused learning hub for official PW content.')
      .replace(/distraction-free PW learning hub/gi, 'focused PW learning hub');

  return {
    ...settings,
    siteName: settings.siteName.includes('YT Wallah') ? 'PW StudyVerse' : replaceLegacy(settings.siteName),
    siteTagline: replaceLegacy(settings.siteTagline),
    siteDescription: replaceLegacy(settings.siteDescription),
    footerText: replaceLegacy(settings.footerText),
    welcomeMessage: replaceLegacy(settings.welcomeMessage),
  };
}

export function YTWallahProvider({ children }: { children: ReactNode }) {
  const [channels, setChannels] = useState<Channel[]>(defaultChannels);
  const [myChannelIds, setMyChannelIds] = useState<string[]>([]);
  const [batches, setBatches] = useState<Batch[]>(defaultBatches);
  const [videos, setVideos] = useState<Video[]>(defaultVideos);
  const [announcements, setAnnouncements] = useState<Announcement[]>(defaultAnnouncements);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  const persistMyChannelIds = useCallback((channelIds: string[]) => {
    try {
      saveMyChannelIds(channelIds);
    } catch (error) {
      console.error('Failed to persist My Channels ids:', error);
    }
  }, []);

  const myChannels = useMemo(
    () => channels.filter((channel) => myChannelIds.includes(channel.id)),
    [channels, myChannelIds]
  );

  // Load from database on mount
  useEffect(() => {
    setMounted(true);
    // Fetch all data from API routes (backed by SQLite)
    // Prefer localStorage seeded channels for prototype if available
    try {
      const storedChannels = getChannels();
      if (storedChannels && storedChannels.length) setChannels(storedChannels);
      setMyChannelIds(getMyChannelIds());
      setBatches(getBatches());
      setVideos(getVideos());
      setAnnouncements(getAnnouncements());
      setSiteSettings(sanitizeLegacyBranding(getSiteSettings()));
    } catch (error) {
      console.error('Failed to hydrate local app state:', error);
    }

    const auth = localStorage.getItem('yt-wallah-admin-auth');
    if (auth === 'true') setIsAdminAuthenticated(true);
  }, []);

  // Channel CRUD
  const addChannel = useCallback(
    (channel: Omit<Channel, 'id' | 'createdAt'>) => {
      const existing = channels.find(
        (item) => item.youtubeChannelId === channel.youtubeChannelId
      );

      if (existing) {
        return existing;
      }

      const id = `ch-${Date.now()}`;
      const createdAt = new Date().toISOString();
      const created: Channel = { id, createdAt, ...channel };

      setChannels((prev) => {
        const next = [...prev, created];
        try {
          saveChannels(next);
        } catch (error) {
          console.error('Failed to persist channels:', error);
        }
        return next;
      });

      api<Channel>('/api/channels', { method: 'POST', body: JSON.stringify(created) }).catch(
        console.error
      );

      return created;
    },
    [channels]
  );

  const saveChannelToMyChannels = useCallback(
    (channelId: string) => {
      let result: 'added' | 'already_added' = 'added';

      setMyChannelIds((prev) => {
        if (prev.includes(channelId)) {
          result = 'already_added';
          return prev;
        }

        const next = [...prev, channelId];
        persistMyChannelIds(next);
        return next;
      });

      return result;
    },
    [persistMyChannelIds]
  );

  const addChannelToMyChannels = useCallback(
    (channel: Omit<Channel, 'id' | 'createdAt'>) => {
      const created = addChannel(channel);
      const status = saveChannelToMyChannels(created.id);
      return { status, channel: created };
    },
    [addChannel, saveChannelToMyChannels]
  );

  const removeChannelFromMyChannels = useCallback(
    (channelId: string) => {
      setMyChannelIds((prev) => {
        const next = prev.filter((id) => id !== channelId);
        persistMyChannelIds(next);
        return next;
      });
    },
    [persistMyChannelIds]
  );

  const isChannelInMyChannels = useCallback(
    (channelId: string) => myChannelIds.includes(channelId),
    [myChannelIds]
  );

  const updateChannel = useCallback((id: string, updates: Partial<Channel>) => {
    api<Channel>(`/api/channels/${id}`, { method: 'PATCH', body: JSON.stringify(updates) })
      .then((updated) => setChannels((prev) => prev.map((c) => (c.id === id ? updated : c))))
      .catch(console.error);
  }, []);
  const deleteChannel = useCallback((id: string) => {
    api(`/api/channels/${id}`, { method: 'DELETE' })
      .then(() => {
        setChannels((prev) => {
          const next = prev.filter((c) => c.id !== id);
          try {
            saveChannels(next);
          } catch (error) {
            console.error('Failed to persist channels after delete:', error);
          }
          return next;
        });
        setMyChannelIds((prev) => {
          const next = prev.filter((channelId) => channelId !== id);
          persistMyChannelIds(next);
          return next;
        });
      })
      .catch(console.error);
  }, [persistMyChannelIds]);

  // Batch CRUD
  const addBatch = useCallback((batch: Omit<Batch, 'id' | 'createdAt'>) => {
    const created: Batch = {
      id: `batch-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...batch,
    };
    setBatches((prev) => {
      const next = [...prev, created];
      saveBatches(next);
      return next;
    });
  }, []);
  const updateBatch = useCallback((id: string, updates: Partial<Batch>) => {
    setBatches((prev) => {
      const next = prev.map((batch) => (batch.id === id ? { ...batch, ...updates } : batch));
      saveBatches(next);
      return next;
    });
  }, []);
  const deleteBatch = useCallback((id: string) => {
    setBatches((prev) => {
      const next = prev.filter((batch) => batch.id !== id);
      saveBatches(next);
      return next;
    });
  }, []);

  // Video CRUD
  const addVideo = useCallback((video: Omit<Video, 'id' | 'createdAt'>) => {
    const created: Video = {
      id: `vid-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...video,
    };
    setVideos((prev) => {
      const next = [...prev, created];
      saveVideos(next);
      return next;
    });
  }, []);
  const updateVideo = useCallback((id: string, updates: Partial<Video>) => {
    setVideos((prev) => {
      const next = prev.map((video) => (video.id === id ? { ...video, ...updates } : video));
      saveVideos(next);
      return next;
    });
  }, []);
  const deleteVideo = useCallback((id: string) => {
    setVideos((prev) => {
      const next = prev.filter((video) => video.id !== id);
      saveVideos(next);
      return next;
    });
  }, []);

  // Announcement CRUD
  const addAnnouncement = useCallback((ann: Omit<Announcement, 'id' | 'createdAt'>) => {
    const created: Announcement = {
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...ann,
    };
    setAnnouncements((prev) => {
      const next = [...prev, created];
      saveAnnouncements(next);
      return next;
    });
  }, []);
  const updateAnnouncement = useCallback((id: string, updates: Partial<Announcement>) => {
    setAnnouncements((prev) => {
      const next = prev.map((announcement) =>
        announcement.id === id ? { ...announcement, ...updates } : announcement
      );
      saveAnnouncements(next);
      return next;
    });
  }, []);
  const deleteAnnouncement = useCallback((id: string) => {
    setAnnouncements((prev) => {
      const next = prev.filter((announcement) => announcement.id !== id);
      saveAnnouncements(next);
      return next;
    });
  }, []);

  // Settings
  const updateSiteSettings = useCallback(
    (settings: Partial<SiteSettings>) => {
      const newSettings = sanitizeLegacyBranding({ ...siteSettings, ...settings });
      setSiteSettings(newSettings);
      saveSiteSettings(newSettings);
    },
    [siteSettings]
  );

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

  // Reset all data (re-seeds defaults via API)
  const resetToDefaults = () => {
    setChannels(defaultChannels);
    setMyChannelIds([]);
    try {
      saveChannels(defaultChannels);
      saveMyChannelIds([]);
    } catch (error) {
      console.error('Failed to reset channel storage:', error);
    }
    setBatches(defaultBatches);
    setVideos(defaultVideos);
    setAnnouncements(defaultAnnouncements);
    setSiteSettings(defaultSiteSettings);
    saveBatches(defaultBatches);
    saveVideos(defaultVideos);
    saveAnnouncements(defaultAnnouncements);
    saveSiteSettings(defaultSiteSettings);
    // Note: This only resets the in-memory state.
    // A full DB reset would require a dedicated API endpoint.
  };

  return (
    <YTWallahContext.Provider
      value={{
        channels,
        myChannels,
        myChannelIds,
        batches,
        videos,
        announcements,
        siteSettings,
        addChannel,
        addChannelToMyChannels,
        saveChannelToMyChannels,
        removeChannelFromMyChannels,
        isChannelInMyChannels,
        updateChannel,
        deleteChannel,
        addBatch,
        updateBatch,
        deleteBatch,
        addVideo,
        updateVideo,
        deleteVideo,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        updateSiteSettings,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        resetToDefaults,
        mounted,
      }}
    >
      {children}
    </YTWallahContext.Provider>
  );
}

export function useYTWallah() {
  const context = useContext(YTWallahContext);
  if (!context) throw new Error('useYTWallah must be used within YTWallahProvider');
  return context;
}
