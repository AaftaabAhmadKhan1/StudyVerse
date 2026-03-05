'use client';

import { use, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import FooterNew from '@/components/FooterNew';
import { useYTWallah } from '@/contexts/YTWallahContext';
import {
  Tv, ArrowLeft, Bell, ExternalLink, Users, Video,
  Play, Clock, Eye, Flame, Radio, ListVideo, Info,
  Loader2, ChevronRight, MessageSquare,
  Heart, Share2, Bookmark,
  Sparkles, ImageIcon, BarChart3,
  CheckCircle2, CircleDot, X, ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';

// ---------- Types for fetched YT data ----------
interface YTVideo {
  id: string; title: string; description: string; thumbnailUrl: string;
  publishedAt: string; duration: string; durationSec: number; viewCount: string; likeCount: string;
  type: 'video' | 'short' | 'live'; isLive: boolean; isUpcoming: boolean; liveBroadcastContent: string;
  scheduledStartTime: string;
}
interface YTPlaylist {
  id: string; title: string; description: string; thumbnailUrl: string;
  itemCount: number; publishedAt: string;
}

interface YTPost {
  id: string;
  type: 'text' | 'image' | 'multi_image' | 'poll' | 'video' | 'quiz';
  text: string;
  publishedAt: string;
  likeCount: string;
  commentCount: string;
  channelTitle: string;
  channelThumbnail: string;
  images: string[];
  videoId: string;
  videoTitle: string;
  videoThumbnail: string;
  videoDuration: string;
  videoViewCount: string;
  pollChoices: { text: string; imageUrl: string; votes: string }[];
  pollTotalVotes: string;
}

// ---------- Tab definitions ----------
const TABS = [
  { key: 'videos', label: 'Videos', icon: Play },
  { key: 'shorts', label: 'Shorts', icon: Flame },
  { key: 'live', label: 'Live', icon: Radio },
  { key: 'posts', label: 'Posts', icon: Sparkles },
  { key: 'playlists', label: 'Playlists', icon: ListVideo },
  { key: 'about', label: 'About', icon: Info },
] as const;
type TabKey = (typeof TABS)[number]['key'];

// ---------- Helper ----------
function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

// ============================================================
export default function ChannelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { channels, siteSettings } = useYTWallah();
  const channel = channels.find(c => c.id === id);

  const [activeTab, setActiveTab] = useState<TabKey>('videos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [videos, setVideos] = useState<YTVideo[]>([]);
  const [shorts, setShorts] = useState<YTVideo[]>([]);
  const [liveStreams, setLiveStreams] = useState<YTVideo[]>([]);
  const [upcomingLives, setUpcomingLives] = useState<YTVideo[]>([]);
  const [playlists, setPlaylists] = useState<YTPlaylist[]>([]);
  const [playlistVideos, setPlaylistVideos] = useState<Record<string, YTVideo[]>>({});
  const [expandedPlaylist, setExpandedPlaylist] = useState<string | null>(null);
  const [loadingPlaylist, setLoadingPlaylist] = useState<string | null>(null);
  const [posts, setPosts] = useState<YTPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
  };
  const closeLightbox = () => setLightboxImages([]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxImages.length) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') setLightboxIndex(i => (i + 1) % lightboxImages.length);
      if (e.key === 'ArrowLeft') setLightboxIndex(i => (i - 1 + lightboxImages.length) % lightboxImages.length);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handler);
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [lightboxImages]);

  const fetchContent = useCallback(async () => {
    if (!channel || !siteSettings.youtubeApiKey) { setLoading(false); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/youtube/channel-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId: channel.youtubeChannelId, apiKey: siteSettings.youtubeApiKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setVideos(data.videos || []);
      setShorts(data.shorts || []);
      setLiveStreams(data.liveStreams || []);
      setUpcomingLives(data.upcomingLives || []);
      setPlaylists(data.playlists || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load channel content');
    } finally {
      setLoading(false);
    }
  }, [channel, siteSettings.youtubeApiKey]);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  // Fetch posts when Posts tab is active
  const fetchPosts = useCallback(async () => {
    if (!channel || posts.length > 0) return;
    setPostsLoading(true);
    try {
      const res = await fetch('/api/youtube/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId: channel.youtubeChannelId }),
      });
      const data = await res.json();
      if (res.ok) setPosts(data.posts || []);
    } catch { /* ignore */ }
    setPostsLoading(false);
  }, [channel, posts.length]);

  useEffect(() => {
    if (activeTab === 'posts') fetchPosts();
  }, [activeTab, fetchPosts]);

  const toggleLikePost = (id: string) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleSavePost = (id: string) => {
    setSavedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const fetchPlaylistVideos = async (playlistId: string) => {
    if (playlistVideos[playlistId]) {
      setExpandedPlaylist(expandedPlaylist === playlistId ? null : playlistId);
      return;
    }
    setLoadingPlaylist(playlistId);
    setExpandedPlaylist(playlistId);
    try {
      const res = await fetch('/api/youtube/playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playlistId, apiKey: siteSettings.youtubeApiKey }),
      });
      const data = await res.json();
      setPlaylistVideos(prev => ({ ...prev, [playlistId]: data.videos || [] }));
    } catch { /* ignore */ }
    setLoadingPlaylist(null);
  };

  // ---- Not found ----
  if (!channel) {
    return (
      <main className="min-h-screen bg-[#030014]">
        <Navigation />
        <div className="md:ml-52 lg:ml-60 pt-20 md:pt-0 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Tv className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Channel Not Found</h2>
            <Link href="/channels" className="text-purple-400 hover:text-purple-300">← Back to Channels</Link>
          </div>
        </div>
      </main>
    );
  }

  // ---- Render helpers ----
  const VideoGrid = ({ items, emptyMsg }: { items: YTVideo[]; emptyMsg: string }) => (
    items.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
          <Link
            href={`/watch/${v.id}`}
            className="group bg-[#0f0a1f]/80 border border-purple-500/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 block"
          >
            <div className="relative aspect-video bg-[#1a1035] overflow-hidden">
              <img src={v.thumbnailUrl} alt={v.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={e => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 bg-purple-600/90 rounded-full flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
              </div>
              {v.duration && !v.isLive && (
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-[11px] text-white font-medium">{v.duration}</span>
              )}
              {v.isLive && (
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 rounded text-[11px] text-white font-bold animate-pulse flex items-center gap-1">
                  <Radio className="w-3 h-3" /> LIVE
                </span>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-purple-300 transition-colors leading-snug">{v.title}</h3>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-white/40">
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{v.viewCount}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(v.publishedAt)}</span>
              </div>
            </div>
          </Link>
          </motion.div>
        ))}
      </div>
    ) : (
      <div className="text-center py-20">
        <Video className="w-12 h-12 text-white/10 mx-auto mb-3" />
        <p className="text-white/30 text-sm">{emptyMsg}</p>
      </div>
    )
  );

  const ShortsGrid = ({ items }: { items: YTVideo[] }) => (
    items.length > 0 ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {items.map((v, i) => (
          <Link
            key={v.id}
            href={`/shorts/${v.id}?channel=${channel?.id || ''}`}
            className="group relative aspect-[9/16] bg-[#0f0a1f] border border-purple-500/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all"
          >
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02 }} className="w-full h-full">
            <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2.5">
              <h3 className="text-xs font-semibold text-white line-clamp-2 leading-tight">{v.title}</h3>
              <p className="text-[10px] text-white/40 mt-1 flex items-center gap-1"><Eye className="w-2.5 h-2.5" />{v.viewCount}</p>
            </div>
            </motion.div>
          </Link>
        ))}
      </div>
    ) : (
      <div className="text-center py-20">
        <Flame className="w-12 h-12 text-white/10 mx-auto mb-3" />
        <p className="text-white/30 text-sm">No shorts found</p>
      </div>
    )
  );

  return (
    <main className="min-h-screen bg-[#030014]">
      <Navigation />
      <div className="md:ml-52 lg:ml-60 pt-16 md:pt-0">
        {/* Banner */}
        <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">
          {channel.bannerUrl ? (
            <img src={channel.bannerUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-purple-900/40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-[#030014]/30 to-transparent" />
        </div>

        <div className="px-4 md:px-6 -mt-14 relative z-10 max-w-7xl mx-auto">
          {/* Back */}
          <Link href="/channels" className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-white mb-3 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> All Channels
          </Link>

          {/* Channel header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5 mb-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-2xl shadow-purple-500/30 border-4 border-[#030014] flex-shrink-0 overflow-hidden">
              {channel.thumbnailUrl ? (
                <img src={channel.thumbnailUrl} alt={channel.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <Tv className="w-10 h-10 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{channel.name}</h1>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="text-xs text-white/40 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {channel.subscriberCount} subscribers</span>
                <span className="text-xs text-white/40 flex items-center gap-1"><Video className="w-3.5 h-3.5" /> {channel.videoCount} videos</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a href={`https://www.youtube.com/channel/${channel.youtubeChannelId}?sub_confirmation=1`}
                target="_blank" rel="noopener noreferrer"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-full transition-colors flex items-center gap-2 shadow-lg shadow-red-500/20">
                <Bell className="w-4 h-4" /> Subscribe
              </a>
              <a href={`https://www.youtube.com/channel/${channel.youtubeChannelId}`}
                target="_blank" rel="noopener noreferrer"
                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors">
                <ExternalLink className="w-4 h-4 text-white/60" />
              </a>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-white/5 mb-6 overflow-x-auto scrollbar-hide">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isAct = activeTab === tab.key;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`relative px-4 py-3 text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${isAct ? 'text-white' : 'text-white/40 hover:text-white/60'}`}>
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isAct && (
                    <motion.div layoutId="channel-tab-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              <span className="text-white/40 ml-3 text-sm">Loading from YouTube...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="inline-block p-4 bg-red-500/10 border border-red-500/20 rounded-2xl mb-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
              <p className="text-white/30 text-xs mt-2">Make sure YouTube API Key is set in Admin → Settings</p>
            </div>
          ) : !siteSettings.youtubeApiKey ? (
            <div className="text-center py-20">
              <Video className="w-14 h-14 text-white/10 mx-auto mb-4" />
              <p className="text-white/40 text-sm">YouTube API Key not configured</p>
              <p className="text-white/20 text-xs mt-1">Admin must add a YouTube API key in Settings to show channel content.</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                {/* Videos tab */}
                {activeTab === 'videos' && <VideoGrid items={videos} emptyMsg="No videos found on this channel" />}

                {/* Shorts tab */}
                {activeTab === 'shorts' && <ShortsGrid items={shorts} />}

                {/* Live tab */}
                {activeTab === 'live' && (
                  <div className="space-y-8">
                    {/* Currently live */}
                    {liveStreams.filter(v => v.isLive).length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                          </span>
                          <h3 className="text-lg font-semibold text-white">Live Now</h3>
                        </div>
                        <VideoGrid items={liveStreams.filter(v => v.isLive)} emptyMsg="" />
                      </div>
                    )}
                    {/* Upcoming lives */}
                    {upcomingLives.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <h3 className="text-lg font-semibold text-white">Upcoming</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {upcomingLives.map((v, i) => (
                            <motion.div key={v.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                              <div className="bg-[#0f0a1f]/80 border border-blue-500/10 rounded-2xl overflow-hidden">
                                <div className="relative aspect-video bg-[#1a1035] overflow-hidden">
                                  <img src={v.thumbnailUrl} alt={v.title}
                                    className="w-full h-full object-cover"
                                    onError={e => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`; }} />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-blue-600 rounded text-[11px] text-white font-bold flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> UPCOMING
                                  </span>
                                </div>
                                <div className="p-3">
                                  <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug">{v.title}</h3>
                                  {v.scheduledStartTime && (
                                    <p className="text-[11px] text-blue-400 mt-1.5">
                                      Scheduled: {new Date(v.scheduledStartTime).toLocaleString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Past live streams */}
                    {liveStreams.filter(v => !v.isLive).length > 0 && (
                      <div>
                        {(liveStreams.filter(v => v.isLive).length > 0 || upcomingLives.length > 0) && (
                          <h3 className="text-lg font-semibold text-white mb-4">Past Streams</h3>
                        )}
                        <VideoGrid items={liveStreams.filter(v => !v.isLive)} emptyMsg="" />
                      </div>
                    )}
                    {liveStreams.length === 0 && upcomingLives.length === 0 && (
                      <div className="text-center py-20">
                        <Video className="w-12 h-12 text-white/10 mx-auto mb-3" />
                        <p className="text-white/30 text-sm">No live streams found</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Posts tab */}
                {activeTab === 'posts' && (
                  postsLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                      <span className="text-white/40 ml-3 text-sm">Loading community posts...</span>
                    </div>
                  ) : posts.length > 0 ? (
                    <div className="max-w-2xl mx-auto space-y-6">
                      {posts.map((post, i) => {
                        const isLiked = likedPosts.has(post.id);
                        const isSaved = savedPosts.has(post.id);
                        const isExpanded = expandedPostId === post.id;

                        return (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, type: 'spring', stiffness: 200 }}
                          >
                            <div className="relative group">
                              {/* Glow effect on hover */}
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/0 via-pink-600/0 to-purple-600/0 group-hover:from-purple-600/20 group-hover:via-pink-600/20 group-hover:to-purple-600/20 rounded-3xl blur-sm transition-all duration-500" />

                              <div className="relative bg-[#0f0a1f]/90 backdrop-blur-sm border border-purple-500/10 group-hover:border-purple-500/20 rounded-3xl overflow-hidden transition-all duration-300">
                                {/* Post header */}
                                <div className="flex items-center gap-3 px-5 pt-5 pb-3">
                                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-purple-500/20">
                                    {post.channelThumbnail ? (
                                      <img src={post.channelThumbnail} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm font-bold">
                                        {(post.channelTitle || '?')[0]}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-white">{post.channelTitle}</h4>
                                    <p className="text-[11px] text-white/30">{post.publishedAt}</p>
                                  </div>
                                  {/* Post type badge */}
                                  {post.type === 'poll' || post.type === 'quiz' ? (
                                    <span className="px-2.5 py-1 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 border border-indigo-500/20 rounded-full text-[10px] font-bold text-indigo-400 flex items-center gap-1">
                                      <BarChart3 className="w-3 h-3" /> {post.type === 'quiz' ? 'Quiz' : 'Poll'}
                                    </span>
                                  ) : post.type === 'video' ? (
                                    <span className="px-2.5 py-1 bg-purple-500/15 border border-purple-500/20 rounded-full text-[10px] font-bold text-purple-400 flex items-center gap-1">
                                      <Play className="w-3 h-3" /> Video
                                    </span>
                                  ) : post.type === 'image' || post.type === 'multi_image' ? (
                                    <span className="px-2.5 py-1 bg-pink-500/15 border border-pink-500/20 rounded-full text-[10px] font-bold text-pink-400 flex items-center gap-1">
                                      <ImageIcon className="w-3 h-3" /> Image
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                                      <Sparkles className="w-3 h-3" /> Post
                                    </span>
                                  )}
                                </div>

                                {/* Post text */}
                                {post.text && (
                                  <div className="px-5 pb-3">
                                    <p className={`text-sm text-white/70 leading-relaxed whitespace-pre-line ${!isExpanded ? 'line-clamp-4' : ''}`}>
                                      {post.text}
                                    </p>
                                    {post.text.length > 200 && (
                                      <button
                                        onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                                        className="text-purple-400 hover:text-purple-300 text-xs mt-1 font-medium transition-colors"
                                      >
                                        {isExpanded ? 'Show less' : 'Read more'}
                                      </button>
                                    )}
                                  </div>
                                )}

                                {/* Image(s) */}
                                {post.images.length === 1 && (
                                  <div className="mx-5 mb-4">
                                    <div
                                      className="rounded-2xl overflow-hidden border border-white/5 cursor-pointer"
                                      onClick={() => openLightbox(post.images, 0)}
                                    >
                                      <img
                                        src={post.images[0]}
                                        alt="Post image"
                                        className="w-full max-h-[500px] object-cover hover:scale-[1.02] transition-transform duration-500"
                                      />
                                    </div>
                                  </div>
                                )}
                                {post.images.length > 1 && (
                                  <div className={`mx-5 mb-4 grid gap-2 ${post.images.length === 2 ? 'grid-cols-2' : post.images.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                                    {post.images.slice(0, 4).map((img, idx) => (
                                      <div
                                        key={idx}
                                        className="rounded-xl overflow-hidden border border-white/5 relative cursor-pointer"
                                        onClick={() => openLightbox(post.images, idx)}
                                      >
                                        <img
                                          src={img}
                                          alt={`Post image ${idx + 1}`}
                                          className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                        {idx === 3 && post.images.length > 4 && (
                                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="text-white text-xl font-bold">+{post.images.length - 4}</span>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Video attachment */}
                                {post.type === 'video' && post.videoId && (
                                  <Link href={`/watch/${post.videoId}`} className="block mx-5 mb-4">
                                    <div className="relative aspect-video rounded-2xl overflow-hidden group/thumb bg-[#1a1035] border border-white/5">
                                      <img
                                        src={post.videoThumbnail || `https://img.youtube.com/vi/${post.videoId}/maxresdefault.jpg`}
                                        alt={post.videoTitle}
                                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                      {/* Play button */}
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-14 h-14 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover/thumb:bg-purple-600/70 group-hover/thumb:scale-110 transition-all duration-300 shadow-2xl">
                                          <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                                        </div>
                                      </div>
                                      {/* Duration badge */}
                                      {post.videoDuration && (
                                        <span className="absolute bottom-3 right-3 px-1.5 py-0.5 bg-black/80 rounded text-[11px] text-white font-medium">
                                          {post.videoDuration}
                                        </span>
                                      )}
                                      {/* Title overlay */}
                                      <div className="absolute bottom-0 left-0 right-0 p-3">
                                        <h3 className="text-sm font-semibold text-white line-clamp-2">{post.videoTitle}</h3>
                                        {post.videoViewCount && (
                                          <span className="text-[10px] text-white/50 flex items-center gap-1 mt-1">
                                            <Eye className="w-3 h-3" /> {post.videoViewCount}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </Link>
                                )}

                                {/* Poll / Quiz */}
                                {(post.type === 'poll' || post.type === 'quiz') && post.pollChoices.length > 0 && (
                                  <div className="mx-5 mb-4 space-y-2">
                                    {post.pollChoices.map((choice, idx) => {
                                      const pct = choice.votes ? parseInt(choice.votes) : 0;
                                      const isCorrect = post.type === 'quiz' && choice.votes === '✓';
                                      return (
                                        <div
                                          key={idx}
                                          className={`relative rounded-xl overflow-hidden border transition-all ${
                                            isCorrect
                                              ? 'border-emerald-500/30 bg-emerald-500/10'
                                              : 'border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-purple-500/20'
                                          }`}
                                        >
                                          {/* Progress bar for polls */}
                                          {post.type === 'poll' && choice.votes && (
                                            <div
                                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500/10 to-purple-500/5 rounded-xl transition-all"
                                              style={{ width: `${pct}%` }}
                                            />
                                          )}
                                          <div className="relative flex items-center gap-3 px-4 py-3">
                                            {choice.imageUrl && (
                                              <img src={choice.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                                            )}
                                            {post.type === 'quiz' && (
                                              isCorrect ? (
                                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                              ) : (
                                                <CircleDot className="w-5 h-5 text-white/20 flex-shrink-0" />
                                              )
                                            )}
                                            <span className={`text-sm flex-1 ${
                                              isCorrect ? 'text-emerald-300 font-medium' : 'text-white/70'
                                            }`}>
                                              {choice.text}
                                            </span>
                                            {post.type === 'poll' && choice.votes && (
                                              <span className="text-xs text-purple-400 font-medium flex-shrink-0">{choice.votes}</span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                    {post.pollTotalVotes && (
                                      <p className="text-[11px] text-white/25 mt-1">{post.pollTotalVotes}</p>
                                    )}
                                  </div>
                                )}

                                {/* Engagement stats bar */}
                                {(post.likeCount || post.commentCount) && (
                                  <div className="px-5 pb-2">
                                    <div className="flex items-center gap-4 text-[11px] text-white/30">
                                      {post.likeCount && post.likeCount !== '0' && <span>{post.likeCount} likes</span>}
                                      {post.commentCount && post.commentCount !== '0' && <span>{post.commentCount} comments</span>}
                                    </div>
                                  </div>
                                )}

                                {/* Action buttons */}
                                <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => toggleLikePost(post.id)}
                                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                                        isLiked
                                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                          : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                                      }`}
                                    >
                                      <Heart className={`w-4 h-4 transition-transform ${isLiked ? 'fill-purple-400 scale-110' : ''}`} />
                                      {isLiked ? 'Liked' : 'Like'}
                                    </button>
                                    <button
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
                                    >
                                      <MessageSquare className="w-4 h-4" />
                                      Comment
                                    </button>
                                    <button
                                      onClick={async () => {
                                        const url = post.videoId
                                          ? `${window.location.origin}/watch/${post.videoId}`
                                          : window.location.href;
                                        if (navigator.share) {
                                          try { await navigator.share({ title: post.text?.slice(0, 50) || 'Post', url }); } catch {}
                                        } else {
                                          await navigator.clipboard.writeText(url);
                                        }
                                      }}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
                                    >
                                      <Share2 className="w-4 h-4" />
                                      Share
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => toggleSavePost(post.id)}
                                    className={`p-1.5 rounded-full transition-all ${
                                      isSaved ? 'text-yellow-400' : 'text-white/30 hover:text-white/60'
                                    }`}
                                  >
                                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-yellow-400' : ''}`} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <Sparkles className="w-12 h-12 text-white/10 mx-auto mb-3" />
                      <p className="text-white/30 text-sm">No community posts found</p>
                      <p className="text-white/20 text-xs mt-1">This channel may not have a Community tab on YouTube</p>
                    </div>
                  )
                )}

                {/* Playlists tab */}
                {activeTab === 'playlists' && (
                  playlists.length > 0 ? (
                    <div className="space-y-3">
                      {playlists.map((pl, i) => (
                        <motion.div key={pl.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                          <button onClick={() => fetchPlaylistVideos(pl.id)}
                            className="w-full bg-[#0f0a1f]/80 border border-purple-500/10 rounded-2xl p-4 hover:border-purple-500/20 transition-all text-left group">
                            <div className="flex items-center gap-4">
                              <div className="w-40 aspect-video rounded-xl overflow-hidden bg-[#1a1035] flex-shrink-0 relative">
                                {pl.thumbnailUrl && <img src={pl.thumbnailUrl} alt="" className="w-full h-full object-cover" />}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <div className="text-center">
                                    <ListVideo className="w-5 h-5 text-white mx-auto" />
                                    <span className="text-xs text-white font-bold">{pl.itemCount}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">{pl.title}</h3>
                                <p className="text-xs text-white/30 mt-1 line-clamp-2">{pl.description || 'No description'}</p>
                                <div className="flex items-center gap-3 mt-2 text-[11px] text-white/30">
                                  <span>{pl.itemCount} videos</span>
                                  <span>{timeAgo(pl.publishedAt)}</span>
                                </div>
                              </div>
                              <ChevronRight className={`w-5 h-5 text-white/20 transition-transform flex-shrink-0 ${expandedPlaylist === pl.id ? 'rotate-90' : ''}`} />
                            </div>
                          </button>

                          {/* Expanded playlist videos */}
                          <AnimatePresence>
                            {expandedPlaylist === pl.id && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden">
                                <div className="p-4 pl-8 space-y-2">
                                  {loadingPlaylist === pl.id ? (
                                    <div className="flex items-center gap-2 py-4 text-white/30 text-sm">
                                      <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                                    </div>
                                  ) : (playlistVideos[pl.id] || []).map((v, idx) => (
                                    <Link key={v.id} href={`/watch/${v.id}`}
                                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group/vid">
                                      <span className="text-xs text-white/20 w-5 text-right flex-shrink-0">{idx + 1}</span>
                                      <div className="w-28 aspect-video rounded-lg overflow-hidden bg-[#1a1035] flex-shrink-0 relative">
                                        <img src={v.thumbnailUrl || `https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                                          alt="" className="w-full h-full object-cover" />
                                        {v.duration && <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 rounded text-[9px] text-white">{v.duration}</span>}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-medium text-white line-clamp-2 group-hover/vid:text-purple-300 transition-colors">{v.title}</h4>
                                        <span className="text-[10px] text-white/30 mt-1 flex items-center gap-1"><Eye className="w-2.5 h-2.5" />{v.viewCount}</span>
                                      </div>
                                    </Link>
                                  ))}
                                  <a href={`https://www.youtube.com/playlist?list=${pl.id}`} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 pt-2 transition-colors">
                                    View full playlist on YouTube <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <ListVideo className="w-12 h-12 text-white/10 mx-auto mb-3" />
                      <p className="text-white/30 text-sm">No playlists found</p>
                    </div>
                  )
                )}

                {/* About tab */}
                {activeTab === 'about' && (
                  <div className="max-w-2xl">
                    <div className="bg-[#0f0a1f]/80 border border-purple-500/10 rounded-2xl p-6 space-y-6">
                      <div>
                        <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Description</h3>
                        <p className="text-sm text-white/70 whitespace-pre-line leading-relaxed">
                          {channel.description || 'No description available.'}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#1a1035]/60 rounded-xl p-4 border border-purple-500/5">
                          <p className="text-2xl font-bold text-white">{channel.subscriberCount}</p>
                          <p className="text-xs text-white/40 mt-1">Subscribers</p>
                        </div>
                        <div className="bg-[#1a1035]/60 rounded-xl p-4 border border-purple-500/5">
                          <p className="text-2xl font-bold text-white">{channel.videoCount}</p>
                          <p className="text-xs text-white/40 mt-1">Videos</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Links</h3>
                        <div className="flex flex-wrap gap-2">
                          <a href={`https://www.youtube.com/channel/${channel.youtubeChannelId}`}
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs border border-red-500/10 hover:bg-red-500/20 transition-all">
                            <Play className="w-3 h-3" /> YouTube Channel
                          </a>
                          <a href={`https://www.youtube.com/channel/${channel.youtubeChannelId}?sub_confirmation=1`}
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-lg text-xs border border-purple-500/10 hover:bg-purple-500/20 transition-all">
                            <Bell className="w-3 h-3" /> Subscribe
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
        <div className="mt-16">
          <FooterNew />
        </div>
      </div>

      {/* ===== Image Lightbox Overlay ===== */}
      <AnimatePresence>
        {lightboxImages.length > 0 && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Counter */}
            {lightboxImages.length > 1 && (
              <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-white/10 text-white/70 text-sm font-medium">
                {lightboxIndex + 1} / {lightboxImages.length}
              </div>
            )}

            {/* Previous button */}
            {lightboxImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length); }}
                className="absolute left-3 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next button */}
            {lightboxImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % lightboxImages.length); }}
                className="absolute right-3 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Image */}
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              src={lightboxImages[lightboxIndex]}
              alt={`Image ${lightboxIndex + 1}`}
              className="relative z-[1] max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}