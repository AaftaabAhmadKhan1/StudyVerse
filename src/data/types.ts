// ============================================================
// PW StudyVerse - Data Types
// ============================================================

export interface Channel {
  id: string;
  name: string;
  youtubeChannelId: string;
  description: string;
  thumbnailUrl: string;
  bannerUrl: string;
  subscriberCount: string;
  videoCount: string;
  isActive: boolean;
  createdAt: string;
}

export interface Batch {
  id: string;
  name: string;
  channelId: string;
  description: string;
  thumbnailUrl: string;
  subjects: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Video {
  id: string;
  title: string;
  youtubeVideoId: string;
  channelId: string;
  batchId: string;
  subject: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  type: 'video' | 'live' | 'short';
  isLive: boolean;
  publishedAt: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'global' | 'batch';
  batchId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface StudyResourceNote {
  id: string;
  title: string;
  board: 'CBSE' | 'ICSE';
  classLevel: '9th' | '10th' | '11th' | '12th';
  format: 'pdf' | 'drive';
  url: string;
  thumbnailUrl?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface BattlePromoVideo {
  id: string;
  board: 'CBSE' | 'ICSE';
  classLevel: '9th' | '10th' | '11th' | '12th';
  title: string;
  videoUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface Note {
  id: string;
  videoId: string;
  userId: string;
  content: string;
  timestamp: number; // seconds in video
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // hashed in production
  avatar?: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'superadmin' | 'admin' | 'moderator';
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  footerText: string;
  socialLinks: {
    youtube?: string;
    telegram?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  maintenanceMode: boolean;
  welcomeMessage: string;
  youtubeApiKey: string;
  battleOfBrainsDemoVideoId: string;
  battlePromoVideos: BattlePromoVideo[];
  studyNotes: StudyResourceNote[];
}

// YouTube API types
export interface YouTubeChannelInfo {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
    customUrl: string;
  };
  statistics: {
    subscriberCount: string;
    videoCount: string;
    viewCount: string;
  };
  brandingSettings?: {
    image?: {
      bannerExternalUrl: string;
    };
  };
}

export interface YouTubeVideoInfo {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
      maxres?: { url: string };
    };
    channelId: string;
    channelTitle: string;
    publishedAt: string;
    liveBroadcastContent: 'live' | 'upcoming' | 'none';
  };
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

// Helper to generate unique IDs
export function generateId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const segments: string[] = [];
  for (let i = 0; i < 4; i++) {
    let segment = '';
    for (let j = 0; j < 6; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    segments.push(segment);
  }
  return segments.join('-');
}
