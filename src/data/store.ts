// ============================================================
// PW StudyVerse - Default Data & Sample Content
// ============================================================

import { Channel, Batch, Video, Announcement, SiteSettings } from './types';

// Default Site Settings
export const defaultSiteSettings: SiteSettings = {
  siteName: 'PW StudyVerse',
  siteTagline: 'Focused learning with official PW content',
  siteDescription: 'Access all Physics Wallah YouTube content in one place — no distractions, just pure learning.',
  logoUrl: '',
  primaryColor: '#7c3aed',
  accentColor: '#ec4899',
  footerText: '© 2026 PW StudyVerse. Uses YouTube embeds and YouTube API Services in a compliance-first study workflow.',
  socialLinks: {
    youtube: 'https://youtube.com/@PhysicsWallah',
    telegram: 'https://t.me/physicswallah',
    instagram: 'https://instagram.com/physicswallah',
    twitter: 'https://twitter.com/PhysicsWallah',
  },
  maintenanceMode: false,
  welcomeMessage: 'Welcome to PW StudyVerse — your focused learning hub for official PW content.',
  youtubeApiKey: 'AIzaSyBsGZNsD-W2Wsc_YTUng-H8-hEJ6Nr9uVg',
  battleOfBrainsDemoVideoId: '',
  battlePromoVideos: [],
  studyNotes: [],
};

// Sample Channels
export const defaultChannels: Channel[] = [
  {
    id: 'ch-001',
    name: 'Physics Wallah',
    youtubeChannelId: 'UCiGyWN6DEbnj2alu7iapuKQ',
    description: 'The main Physics Wallah channel with complete lectures for JEE & NEET preparation.',
    thumbnailUrl: 'https://yt3.googleusercontent.com/ytc/AIdro_nM5NRWU9rPJ0JRO4L6ixGWQDwXhDBdJNOQmTOVYkfnMA=s176-c-k-c0x00ffffff-no-rj',
    bannerUrl: 'https://yt3.googleusercontent.com/ytc/AIdro_nM5NRWU9rPJ0JRO4L6ixGWQDwXhDBdJNOQmTOVYkfnMA=s176-c-k-c0x00ffffff-no-rj',
    subscriberCount: '25M+',
    videoCount: '5000+',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ch-002',
    name: 'PW Foundation',
    youtubeChannelId: 'UCA2DIfbuZVsMWrRtgG9N4mw',
    description: 'Foundation courses for Class 9-10 students covering all subjects.',
    thumbnailUrl: 'https://yt3.googleusercontent.com/ytc/AIdro_nM5NRWU9rPJ0JRO4L6ixGWQDwXhDBdJNOQmTOVYkfnMA=s176-c-k-c0x00ffffff-no-rj',
    bannerUrl: '',
    subscriberCount: '5M+',
    videoCount: '2000+',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

// Sample Batches
export const defaultBatches: Batch[] = [
  {
    id: 'batch-001',
    name: 'Lakshya JEE 2026',
    channelId: 'ch-001',
    description: 'Complete JEE 2026 preparation batch with all subjects covered.',
    thumbnailUrl: '',
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'batch-002',
    name: 'Yakeen NEET 2026',
    channelId: 'ch-001',
    description: 'Full NEET 2026 preparation batch with Biology, Physics, and Chemistry.',
    thumbnailUrl: '',
    subjects: ['Physics', 'Chemistry', 'Biology'],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'batch-003',
    name: 'Arjuna JEE 2027',
    channelId: 'ch-001',
    description: 'Early start JEE 2027 preparation for Class 11 students.',
    thumbnailUrl: '',
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

// Sample Videos
export const defaultVideos: Video[] = [
  {
    id: 'vid-001',
    title: 'Complete Physics Revision | JEE 2026',
    youtubeVideoId: 'dQw4w9WgXcQ',
    channelId: 'ch-001',
    batchId: 'batch-001',
    subject: 'Physics',
    description: 'Complete revision of all physics topics for JEE 2026.',
    thumbnailUrl: '',
    duration: '3:24:15',
    type: 'video',
    isLive: false,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vid-002',
    title: 'Organic Chemistry Marathon | NEET 2026',
    youtubeVideoId: 'dQw4w9WgXcQ',
    channelId: 'ch-001',
    batchId: 'batch-002',
    subject: 'Chemistry',
    description: 'Complete organic chemistry marathon for NEET preparation.',
    thumbnailUrl: '',
    duration: '5:12:30',
    type: 'video',
    isLive: false,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

// Sample Announcements
export const defaultAnnouncements: Announcement[] = [
  {
    id: 'ann-001',
    title: 'Welcome to PW StudyVerse!',
    content: 'We are excited to launch PW StudyVerse — a focused study interface for official Physics Wallah content.',
    type: 'global',
    priority: 'high',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ann-002',
    title: 'Lakshya JEE 2026 - New Schedule Released',
    content: 'The new lecture schedule for Lakshya JEE 2026 batch has been released. Check the batch page for details.',
    type: 'batch',
    batchId: 'batch-001',
    priority: 'medium',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

// LocalStorage helpers
export function getSiteSettings(): SiteSettings {
  if (typeof window === 'undefined') return defaultSiteSettings;
  try {
    const stored = localStorage.getItem('yt-wallah-settings');
    return stored ? JSON.parse(stored) : defaultSiteSettings;
  } catch {
    return defaultSiteSettings;
  }
}

export function saveSiteSettings(settings: SiteSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('yt-wallah-settings', JSON.stringify(settings));
}

export function getChannels(): Channel[] {
  if (typeof window === 'undefined') return defaultChannels;
  try {
    const stored = localStorage.getItem('yt-wallah-channels');
    return stored ? JSON.parse(stored) : defaultChannels;
  } catch {
    return defaultChannels;
  }
}

export function saveChannels(channels: Channel[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('yt-wallah-channels', JSON.stringify(channels));
}

export function getMyChannelIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('yt-wallah-my-channel-ids');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveMyChannelIds(channelIds: string[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('yt-wallah-my-channel-ids', JSON.stringify(channelIds));
}

export function getBatches(): Batch[] {
  if (typeof window === 'undefined') return defaultBatches;
  try {
    const stored = localStorage.getItem('yt-wallah-batches');
    return stored ? JSON.parse(stored) : defaultBatches;
  } catch {
    return defaultBatches;
  }
}

export function saveBatches(batches: Batch[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('yt-wallah-batches', JSON.stringify(batches));
}

export function getVideos(): Video[] {
  if (typeof window === 'undefined') return defaultVideos;
  try {
    const stored = localStorage.getItem('yt-wallah-videos');
    return stored ? JSON.parse(stored) : defaultVideos;
  } catch {
    return defaultVideos;
  }
}

export function saveVideos(videos: Video[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('yt-wallah-videos', JSON.stringify(videos));
}

export function getAnnouncements(): Announcement[] {
  if (typeof window === 'undefined') return defaultAnnouncements;
  try {
    const stored = localStorage.getItem('yt-wallah-announcements');
    return stored ? JSON.parse(stored) : defaultAnnouncements;
  } catch {
    return defaultAnnouncements;
  }
}

export function saveAnnouncements(announcements: Announcement[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('yt-wallah-announcements', JSON.stringify(announcements));
}
