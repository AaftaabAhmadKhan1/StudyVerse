'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  StickyNote,
  ThumbsUp,
  Share2,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  BookOpen,
  Plus,
  Trash2,
  Clock,
  Eye,
  Loader2,
  Play,
  Pause,
  Volume1,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Settings,
  Subtitles,
  Gauge,
  PictureInPicture2,
  Check,
  Bookmark,
} from 'lucide-react';
import { Video } from '@/data/types';
import { useAuth } from '@/contexts/AuthContext';
import ChannelSubscribeButton from '@/components/ChannelSubscribeButton';
// handwritten conversion removed

import { useYTWallah } from '@/contexts/YTWallahContext';
import { loadYouTubeIFrameAPI, formatPlayerTime } from '@/lib/youtubePlayer';

// ---------- Types ----------
interface YTVideoInfo {
  title: string;
  description: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
  tags: string[];
}

interface YTComment {
  id: string;
  authorName: string;
  authorImage: string;
  text: string;
  likeCount: string;
  replyCount: number;
  publishedAt: string;
  timeAgo: string;
  replies: {
    id: string;
    authorName: string;
    authorImage: string;
    text: string;
    likeCount: string;
    timeAgo: string;
  }[];
}

interface Props {
  video: Video;
}

export default function VideoPlayer({ video }: Props) {
  const [activeTab, setActiveTab] = useState<'comments' | 'chat' | 'notes'>('notes');
  const [showDescription, setShowDescription] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteTimestamp, setNoteTimestamp] = useState('0:00');
  const timestampInputRef = useRef<HTMLInputElement | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const {
    isAuthenticated,
    addNote,
    getNotesForVideo,
    deleteNote,
    getDisplaySubscriberCount,
    toggleSavedVideo,
    isVideoSaved,
  } =
    useAuth();
  const { channels, batches, siteSettings } = useYTWallah();

  // ---- Custom player state ----
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const ytPlayerRef = useRef<any>(null);
  const playerDivRef = useRef<HTMLDivElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playerVolume, setPlayerVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  // track fullscreen toggle state
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [showPlayIndicator, setShowPlayIndicator] = useState<'play' | 'pause' | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // ---- Settings menu state ----
  const [showSettings, setShowSettings] = useState(false);
  const [settingsPanel, setSettingsPanel] = useState<'main' | 'quality' | 'speed' | 'captions'>(
    'main'
  );
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [currentQuality, setCurrentQuality] = useState('auto');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [captionTracks, setCaptionTracks] = useState<{ lang: string; name: string }[]>([]);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [currentCaptionLang, setCurrentCaptionLang] = useState('');
  const settingsRef = useRef<HTMLDivElement>(null);

  // YouTube fetched info
  const [ytInfo, setYtInfo] = useState<YTVideoInfo | null>(null);
  const [ytInfoLoading, setYtInfoLoading] = useState(false);

  // Comments
  const [comments, setComments] = useState<YTComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsDisabled, setCommentsDisabled] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  // User reactions (local state — toggling visual only)
  const [likedVideos, setLikedVideos] = useState<Record<string, boolean>>({});
  const batch = batches.find((b) => b.id === video.batchId);
  const notes = getNotesForVideo(video.id);
  const isLive = video.isLive || video.type === 'live';
  const ytId = video.youtubeVideoId;
  const apiKey = siteSettings.youtubeApiKey;
  const channel = channels.find(
    (c) =>
      c.id === video.channelId ||
      c.youtubeChannelId === video.channelId ||
      (!!ytInfo?.channelId && c.youtubeChannelId === ytInfo.channelId)
  );
  const liked = !!likedVideos[ytId || video.id];
  const saved = isVideoSaved(ytId || video.id);

  // Title: prefer fetched, fallback to local
  const title = ytInfo?.title || video.title || 'Loading...';
  const description = ytInfo?.description || video.description || '';
  const channelName = channel?.name || ytInfo?.channelTitle || '';

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pw-studyverse-video-likes');
      setLikedVideos(stored ? JSON.parse(stored) : {});
    } catch {
      setLikedVideos({});
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('pw-studyverse-video-likes', JSON.stringify(likedVideos));
    } catch {
      /* ignore */
    }
  }, [likedVideos]);

  const liveChatUrl = `https://www.youtube.com/live_chat?v=${ytId}&embed_domain=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}`;

  // ---------- Fetch video info ----------
  const fetchVideoInfo = useCallback(async () => {
    if (!ytId || !apiKey) return;
    setYtInfoLoading(true);
    try {
      const res = await fetch('/api/youtube/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: ytId, apiKey }),
      });
      const data = await res.json();
      if (res.ok) {
        setYtInfo({
          title: data.title,
          description: data.description,
          channelTitle: data.channelTitle,
          channelId: data.channelId,
          publishedAt: data.publishedAt,
          viewCount: data.viewCount,
          likeCount: data.likeCount,
          commentCount: data.commentCount,
          tags: data.tags,
        });
      }
    } catch {
      /* silent */
    }
    setYtInfoLoading(false);
  }, [ytId, apiKey]);

  // ---------- Fetch comments ----------
  const fetchComments = useCallback(
    async (pageToken?: string) => {
      if (!ytId || !apiKey) return;
      setCommentsLoading(true);
      try {
        const res = await fetch('/api/youtube/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId: ytId, apiKey, pageToken }),
        });
        const data = await res.json();
        if (res.ok) {
          if (data.disabled) {
            setCommentsDisabled(true);
          } else {
            setComments((prev) => (pageToken ? [...prev, ...data.comments] : data.comments));
            setNextPageToken(data.nextPageToken);
          }
        }
      } catch {
        /* silent */
      }
      setCommentsLoading(false);
    },
    [ytId, apiKey]
  );

  useEffect(() => {
    fetchVideoInfo();
  }, [fetchVideoInfo]);

  // Fetch comments when user switches to comments tab
  useEffect(() => {
    if (activeTab === 'comments' && comments.length === 0 && !commentsDisabled) {
      fetchComments();
    }
  }, [activeTab, comments.length, commentsDisabled, fetchComments]);

  // ---------- Helpers ----------
  const handleAddNote = () => {
    if (!noteText.trim()) return;
    // parse timestamp, fallback to current time
    const ts = parseTimeToSeconds(noteTimestamp.trim());
    const timestamp = ts || currentTime;
    addNote({ videoId: video.id, content: noteText.trim(), timestamp });
    setNoteText('');
    setToast('Note saved');
    setTimeout(() => setToast(null), 3000);
  };

  const parseTimeToSeconds = (t: string) => {
    const parts = t.split(':').map((p) => parseInt(p, 10));
    if (parts.some(isNaN)) return 0;
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return parts[0] || 0;
  };

  const handleAutoGenerateNotes = async () => {
    if (!isAuthenticated) return alert('Please sign in to generate notes');
    const key = window.prompt('Enter your OpenAI API key (will be used for this request)');
    if (!key) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/notes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: ytId, openaiApiKey: key }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to generate notes');
      if (Array.isArray(data.notes)) {
        data.notes.forEach((n: any) => {
          const ts = n.time ? parseTimeToSeconds(n.time) : 0;
          addNote({ videoId: video.id, content: `__ai_handwritten__\n${n.text}`, timestamp: ts });
        });
      }
      if (data.summary) {
        addNote({ videoId: video.id, content: `__ai_handwritten__\nSummary: ${data.summary}`, timestamp: 0 });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      alert(`AI notes failed: ${msg}`);
    }
    setAiLoading(false);
  };


  const formatTimestamp = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const toggleLike = () => {
    const likeKey = ytId || video.id;
    setLikedVideos((prev) => ({ ...prev, [likeKey]: !prev[likeKey] }));
  };
  const toggleReplies = (id: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const handleToggleSave = useCallback(() => {
    toggleSavedVideo({
      id: video.id,
      youtubeVideoId: ytId || video.id,
      title: title || 'Untitled Video',
      thumbnailUrl: video.thumbnailUrl,
      channelName,
    });
    setToast(saved ? 'Removed from saved videos' : 'Saved to Library');
    setTimeout(() => setToast(null), 3000);
  }, [channelName, saved, title, toggleSavedVideo, video.id, video.thumbnailUrl, ytId]);


  // keep noteTimestamp synced to currentTime unless user is editing
  useEffect(() => {
    if (timestampInputRef.current && document.activeElement !== timestampInputRef.current) {
      setNoteTimestamp(formatTimestamp(currentTime));
    }
  }, [currentTime]);

  // ===== YouTube IFrame Player initialization =====
  useEffect(() => {
    let player: any = null;
    let poller: ReturnType<typeof setInterval> | null = null;
    let mounted = true;

    const init = async () => {
      await loadYouTubeIFrameAPI();
      if (!mounted || !playerDivRef.current) return;

      // Create fresh child div for YT to replace
      const el = document.createElement('div');
      playerDivRef.current.innerHTML = '';
      playerDivRef.current.appendChild(el);

        player = new (window as any).YT.Player(el, {
          videoId: ytId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            disablekb: 1,
            fs: 0,
            playsinline: 1,
            enablejsapi: 1,
            cc_load_policy: 0,
            origin: window.location.origin,
        },
        events: {
          onReady: (e: any) => {
            if (!mounted) return;
            ytPlayerRef.current = e.target;
            setPlayerReady(true);
            setDuration(e.target.getDuration() || 0);
            setPlayerVolume(e.target.getVolume());
            // progress poller
            poller = setInterval(() => {
              if (!ytPlayerRef.current) return;
              const ct = ytPlayerRef.current.getCurrentTime();
              const dur = ytPlayerRef.current.getDuration();
              setProgress(ct);
              setCurrentTime(ct); // for notes
              if (dur > 0) setDuration(dur);
              setBuffered(ytPlayerRef.current.getVideoLoadedFraction() * 100);
            }, 200);
            progressTimerRef.current = poller;
          },
          onStateChange: (e: any) => {
            if (!mounted) return;
            setIsPlaying(e.data === 1);
            if (e.data === 0) {
              setIsPlaying(false);
              setShowControls(true);
            }
            // Refresh available qualities when video plays
            if (e.data === 1 && ytPlayerRef.current) {
              try {
                const qs = ytPlayerRef.current.getAvailableQualityLevels();
                if (qs?.length) setAvailableQualities(qs);
                const cq = ytPlayerRef.current.getPlaybackQuality();
                if (cq) setCurrentQuality(cq);
              } catch {
                /* noop */
              }
            }
          },
          onPlaybackQualityChange: (e: any) => {
            if (!mounted) return;
            setCurrentQuality(e.data);
          },
        },
      });
    };

    init();
    return () => {
      mounted = false;
      if (poller) clearInterval(poller);
      try {
        player?.destroy?.();
      } catch {
        /* noop */
      }
      ytPlayerRef.current = null;
      setPlayerReady(false);
    };
  }, [ytId]);  

  // ===== Player control helpers =====
  const togglePlay = useCallback(() => {
    if (!ytPlayerRef.current) return;
    const willPlay = !isPlaying;
    if (willPlay) ytPlayerRef.current.playVideo();
    else ytPlayerRef.current.pauseVideo();
    setShowPlayIndicator(willPlay ? 'play' : 'pause');
    setTimeout(() => setShowPlayIndicator(null), 500);
  }, [isPlaying]);

  const seekTo = useCallback((t: number) => {
    ytPlayerRef.current?.seekTo(t, true);
    setProgress(t);
    setCurrentTime(t);
  }, []);

  const seekRelative = useCallback(
    (d: number) => {
      if (!ytPlayerRef.current) return;
      const playerDuration = ytPlayerRef.current.getDuration?.() || duration;
      const t = Math.max(0, Math.min(ytPlayerRef.current.getCurrentTime() + d, playerDuration));
      seekTo(t);
    },
    [duration, seekTo]
  );

  const handleVolumeChange = useCallback(
    (v: number) => {
      if (!ytPlayerRef.current) return;
      ytPlayerRef.current.setVolume(v);
      setPlayerVolume(v);
      if (v > 0 && isMuted) {
        ytPlayerRef.current.unMute();
        setIsMuted(false);
      }
    },
    [isMuted]
  );

  const handleToggleMute = useCallback(() => {
    if (!ytPlayerRef.current) return;
    if (isMuted) {
      ytPlayerRef.current.unMute();
      setIsMuted(false);
    } else {
      ytPlayerRef.current.mute();
      setIsMuted(true);
    }
  }, [isMuted]);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressBarRef.current || !duration) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      seekTo(((e.clientX - rect.left) / rect.width) * duration);
    },
    [duration, seekTo]
  );

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSettings(false);
      }
    }, 3000);
  }, [isPlaying]);

  const toggleFullscreenMode = useCallback(() => {
    const el = playerContainerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen().then(() => setIsFullscreenMode(true));
    else document.exitFullscreen().then(() => setIsFullscreenMode(false));
  }, []);

  // ===== Quality / Speed / Captions helpers =====
  const qualityLabels: Record<string, string> = {
    highres: '4320p (8K)',
    hd2160: '2160p (4K)',
    hd1440: '1440p',
    hd1080: '1080p',
    hd720: '720p',
    large: '480p',
    medium: '360p',
    small: '240p',
    tiny: '144p',
    auto: 'Auto',
  };
  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  const handleSetQuality = useCallback((q: string) => {
    if (!ytPlayerRef.current) return;
    ytPlayerRef.current.setPlaybackQuality(q);
    setCurrentQuality(q);
    setSettingsPanel('main');
  }, []);

  const handleSetSpeed = useCallback((s: number) => {
    if (!ytPlayerRef.current) return;
    ytPlayerRef.current.setPlaybackRate(s);
    setPlaybackSpeed(s);
    setSettingsPanel('main');
  }, []);

  const handleToggleCaptions = useCallback(() => {
    if (!ytPlayerRef.current) return;
    try {
      // Removed unused variable mod
      if (captionsEnabled) {
        ytPlayerRef.current.unloadModule?.('captions');
        ytPlayerRef.current.unloadModule?.('cc');
        setCaptionsEnabled(false);
        setCurrentCaptionLang('');
      } else {
        ytPlayerRef.current.loadModule?.('captions');
        ytPlayerRef.current.loadModule?.('cc');
        ytPlayerRef.current.setOption?.('captions', 'reload', true);
        ytPlayerRef.current.setOption?.('captions', 'track', {});
        setCaptionsEnabled(true);
      }
    } catch {
      // Fallback: toggle cc_load_policy via internal API
      setCaptionsEnabled(!captionsEnabled);
    }
    setSettingsPanel('main');
  }, [captionsEnabled]);

  const handleSetCaptionLang = useCallback(
    (lang: string) => {
      if (!ytPlayerRef.current) return;
      try {
        ytPlayerRef.current.loadModule?.('captions');
        ytPlayerRef.current.loadModule?.('cc');
        ytPlayerRef.current.setOption?.('captions', 'track', { languageCode: lang });
        ytPlayerRef.current.setOption?.('captions', 'reload', true);
        setCurrentCaptionLang(lang);
        if (!captionsEnabled) {
          setCaptionsEnabled(true);
        }
      } catch {
        /* noop */
      }
      setSettingsPanel('main');
    },
    [captionsEnabled]
  );

  const handlePiP = useCallback(async () => {
    try {
      const iframe = playerDivRef.current?.querySelector('iframe');
      if (!iframe) return;
      // PiP requires accessing the video element inside the iframe - try document PiP
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        // Try to get the video element from the YT iframe
        const video = playerContainerRef.current?.querySelector('video');
        if (video) await video.requestPictureInPicture();
      }
    } catch {
      /* PiP not supported or blocked */
    }
  }, []);

  // Close settings when clicking outside
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
        setSettingsPanel('main');
      }
    };
    if (showSettings) document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [showSettings]);

  // Fetch caption tracks periodically after player is ready
  useEffect(() => {
    if (!playerReady || !ytPlayerRef.current) return;
    const fetchCaptionInfo = () => {
      try {
        const opts = ytPlayerRef.current.getOption?.('captions', 'tracklist');
        if (opts && Array.isArray(opts) && opts.length > 0) {
          setCaptionTracks(
            opts.map((t: any) => ({ lang: t.languageCode, name: t.displayName || t.languageCode }))
          );
        }
      } catch {
        /* noop */
      }
    };
    // Fetch once after a delay (YT needs time to load caption data)
    const timer = setTimeout(fetchCaptionInfo, 2000);
    return () => clearTimeout(timer);
  }, [playerReady]);

  // Keyboard shortcuts
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreenMode();
          break;
        case 'm':
          e.preventDefault();
          handleToggleMute();
          break;
        case 'c':
          e.preventDefault();
          handleToggleCaptions();
          break;
        case 'arrowleft':
          e.preventDefault();
          seekRelative(-5);
          break;
        case 'arrowright':
          e.preventDefault();
          seekRelative(5);
          break;
        case 'j':
          e.preventDefault();
          seekRelative(-10);
          break;
        case 'l':
          e.preventDefault();
          seekRelative(10);
          break;
        case 'arrowup':
          e.preventDefault();
          handleVolumeChange(Math.min(100, playerVolume + 5));
          break;
        case 'arrowdown':
          e.preventDefault();
          handleVolumeChange(Math.max(0, playerVolume - 5));
          break;
        case ',':
          if (e.shiftKey) {
            e.preventDefault();
            handleSetSpeed(Math.max(0.25, playbackSpeed - 0.25));
          }
          break;
        case '.':
          if (e.shiftKey) {
            e.preventDefault();
            handleSetSpeed(Math.min(2, playbackSpeed + 0.25));
          }
          break;
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [
    togglePlay,
    toggleFullscreenMode,
    handleToggleMute,
    handleToggleCaptions,
    seekRelative,
    handleVolumeChange,
    handleSetSpeed,
    playerVolume,
    playbackSpeed,
  ]);

  // Sync fullscreen state
  useEffect(() => {
    const h = () => setIsFullscreenMode(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  const tabs = [
    { id: 'notes' as const, label: 'Notes', icon: StickyNote },
    {
      id: 'comments' as const,
      label: `Comments${ytInfo?.commentCount ? ` (${ytInfo.commentCount})` : ''}`,
      icon: MessageSquare,
    },
    ...(isLive ? [{ id: 'chat' as const, label: 'Live Chat', icon: MessageSquare }] : []),
  ];

  return (
    <div className={`${isTheaterMode ? 'max-w-full' : 'max-w-7xl'} mx-auto`}>
      <div className={`grid ${isTheaterMode ? 'grid-cols-1' : 'lg:grid-cols-3'} gap-6`}>
        {/* ========== Main Player Area ========== */}
        <div className={`${isTheaterMode ? 'col-span-1' : 'lg:col-span-2'}`}>
          {/* ===== Custom YouTube Player ===== */}
          <div
            ref={playerContainerRef}
            className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10 border border-purple-500/10 bg-black"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              if (isPlaying) setShowControls(false);
            }}
          >
            {/* 16:9 aspect-ratio wrapper */}
            <div className="youtube-container">
              <div
                ref={playerDivRef}
                className="youtube-player-crop absolute inset-x-0 -top-3 -bottom-12"
              />
              {/* Click layer for custom controls while native YouTube controls stay hidden */}
              <div
                className="absolute inset-0 z-10 cursor-pointer"
                onClick={togglePlay}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  toggleFullscreenMode();
                }}
              />
            </div>

            {/* Center play/pause indicator */}
            <AnimatePresence>
              {showPlayIndicator && (
                <motion.div
                  key={showPlayIndicator}
                  initial={{ opacity: 0.9, scale: 0.8 }}
                  animate={{ opacity: 0, scale: 1.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                >
                  <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                    {showPlayIndicator === 'play' ? (
                      <Play className="w-7 h-7 text-white fill-white ml-1" />
                    ) : (
                      <Pause className="w-7 h-7 text-white fill-white" />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toast for note creation */}
            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-3 right-3 z-50"
                >
                  <div className="px-3 py-2 bg-black/70 border border-white/10 text-sm text-white rounded-md backdrop-blur-md">
                    {toast}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading spinner */}
            {!playerReady && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
                <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
              </div>
            )}

            {/* Custom Control Bar */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
              animate={{ opacity: showControls || !isPlaying ? 1 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-16 pb-3 px-4 pointer-events-auto">
                {/* Progress bar */}
                <div
                  ref={progressBarRef}
                  className="group/progress relative h-1 hover:h-2 bg-white/20 rounded-full cursor-pointer mb-3 transition-all duration-150"
                  onClick={handleProgressClick}
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-white/15 rounded-full"
                    style={{ width: `${buffered}%` }}
                  />
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md opacity-0 group-hover/progress:opacity-100 scale-0 group-hover/progress:scale-100 transition-all duration-150" />
                  </div>
                </div>

                {/* Controls row */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-purple-300 transition-colors p-1"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </button>
                  <button
                    onClick={() => seekRelative(-10)}
                    className="text-white/60 hover:text-white transition-colors p-1 hidden sm:block"
                    title="Rewind 10s (J)"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => seekRelative(10)}
                    className="text-white/60 hover:text-white transition-colors p-1 hidden sm:block"
                    title="Forward 10s (L)"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] sm:text-xs text-white/60 font-mono tabular-nums min-w-fit">
                    {formatPlayerTime(progress)} / {formatPlayerTime(duration)}
                  </span>

                  <div className="flex-1" />

                  {/* Playback speed indicator (click to cycle) */}
                  {playbackSpeed !== 1 && (
                    <button
                      onClick={() => handleSetSpeed(1)}
                      className="text-[11px] text-purple-400 font-bold px-1.5 py-0.5 bg-purple-500/10 rounded-md hover:bg-purple-500/20 transition-colors"
                      title="Reset speed to 1x"
                    >
                      {playbackSpeed}x
                    </button>
                  )}

                  {/* Captions toggle */}
                  <button
                    onClick={handleToggleCaptions}
                    className={`transition-colors p-1 hidden sm:block ${captionsEnabled ? 'text-purple-400' : 'text-white/60 hover:text-white'}`}
                    title="Captions (C)"
                  >
                    <Subtitles className="w-[18px] h-[18px]" />
                    {captionsEnabled && (
                      <div className="w-4 h-[2px] bg-purple-400 mx-auto rounded-full mt-[-2px]" />
                    )}
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-1 group/vol">
                    <button
                      onClick={handleToggleMute}
                      className="text-white/60 hover:text-white transition-colors p-1"
                      title="Mute (M)"
                    >
                      {isMuted || playerVolume === 0 ? (
                        <VolumeX className="w-[18px] h-[18px]" />
                      ) : playerVolume < 50 ? (
                        <Volume1 className="w-[18px] h-[18px]" />
                      ) : (
                        <Volume2 className="w-[18px] h-[18px]" />
                      )}
                    </button>
                    <div className="w-0 group-hover/vol:w-20 overflow-hidden transition-all duration-200">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={isMuted ? 0 : playerVolume}
                        onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                        className="w-20 h-1 cursor-pointer appearance-none rounded-full bg-white/10"
                        style={{
                          background: `linear-gradient(90deg, rgb(168 85 247) 0%, rgb(236 72 153) ${isMuted ? 0 : playerVolume}%, rgba(255,255,255,0.18) ${isMuted ? 0 : playerVolume}%, rgba(255,255,255,0.18) 100%)`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Settings gear */}
                  <div className="relative" ref={settingsRef}>
                    <button
                      onClick={() => {
                        setShowSettings(!showSettings);
                        setSettingsPanel('main');
                      }}
                      className={`transition-colors p-1 ${showSettings ? 'text-purple-400' : 'text-white/60 hover:text-white'}`}
                      title="Settings"
                    >
                      <Settings
                        className={`w-[18px] h-[18px] transition-transform duration-300 ${showSettings ? 'rotate-45' : ''}`}
                      />
                    </button>

                    {/* Settings dropdown */}
                    <AnimatePresence>
                      {showSettings && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute bottom-10 right-0 w-56 bg-[#1a1035]/95 backdrop-blur-xl border border-purple-500/20 rounded-xl shadow-2xl overflow-hidden z-50"
                        >
                          {/* === Main menu === */}
                          {settingsPanel === 'main' && (
                            <div className="py-1.5">
                              {/* Quality */}
                              <button
                                onClick={() => setSettingsPanel('quality')}
                                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 transition-colors"
                              >
                                <span className="flex items-center gap-2.5">
                                  <Eye className="w-4 h-4 text-white/40" /> Quality
                                </span>
                                <span className="text-xs text-white/40">
                                  {qualityLabels[currentQuality] || currentQuality}
                                </span>
                              </button>
                              {/* Speed */}
                              <button
                                onClick={() => setSettingsPanel('speed')}
                                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 transition-colors"
                              >
                                <span className="flex items-center gap-2.5">
                                  <Gauge className="w-4 h-4 text-white/40" /> Playback speed
                                </span>
                                <span className="text-xs text-white/40">
                                  {playbackSpeed === 1 ? 'Normal' : `${playbackSpeed}x`}
                                </span>
                              </button>
                              {/* Captions */}
                              <button
                                onClick={() =>
                                  captionTracks.length > 0
                                    ? setSettingsPanel('captions')
                                    : handleToggleCaptions()
                                }
                                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 transition-colors"
                              >
                                <span className="flex items-center gap-2.5">
                                  <Subtitles className="w-4 h-4 text-white/40" /> Subtitles/CC
                                </span>
                                <span className="text-xs text-white/40">
                                  {captionsEnabled ? currentCaptionLang || 'On' : 'Off'}
                                </span>
                              </button>
                              {/* PiP */}
                              <button
                                onClick={() => {
                                  handlePiP();
                                  setShowSettings(false);
                                }}
                                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 transition-colors"
                              >
                                <span className="flex items-center gap-2.5">
                                  <PictureInPicture2 className="w-4 h-4 text-white/40" />{' '}
                                  Picture-in-picture
                                </span>
                              </button>
                            </div>
                          )}

                          {/* === Quality sub-panel === */}
                          {settingsPanel === 'quality' && (
                            <div>
                              <button
                                onClick={() => setSettingsPanel('main')}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white/60 hover:bg-white/5 border-b border-white/5"
                              >
                                <ChevronDown className="w-4 h-4 rotate-90" /> Quality
                              </button>
                              <div className="py-1 max-h-56 overflow-y-auto scrollbar-hide">
                                <button
                                  onClick={() => handleSetQuality('auto')}
                                  className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-white/5 transition-colors ${currentQuality === 'auto' ? 'text-purple-400' : 'text-white/70'}`}
                                >
                                  Auto
                                  {currentQuality === 'auto' && <Check className="w-4 h-4" />}
                                </button>
                                {availableQualities.map((q) => (
                                  <button
                                    key={q}
                                    onClick={() => handleSetQuality(q)}
                                    className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-white/5 transition-colors ${currentQuality === q ? 'text-purple-400' : 'text-white/70'}`}
                                  >
                                    {qualityLabels[q] || q}
                                    {currentQuality === q && <Check className="w-4 h-4" />}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* === Speed sub-panel === */}
                          {settingsPanel === 'speed' && (
                            <div>
                              <button
                                onClick={() => setSettingsPanel('main')}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white/60 hover:bg-white/5 border-b border-white/5"
                              >
                                <ChevronDown className="w-4 h-4 rotate-90" /> Playback speed
                              </button>
                              <div className="py-1 max-h-56 overflow-y-auto scrollbar-hide">
                                {speedOptions.map((s) => (
                                  <button
                                    key={s}
                                    onClick={() => handleSetSpeed(s)}
                                    className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-white/5 transition-colors ${playbackSpeed === s ? 'text-purple-400' : 'text-white/70'}`}
                                  >
                                    {s === 1 ? 'Normal' : `${s}x`}
                                    {playbackSpeed === s && <Check className="w-4 h-4" />}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* === Captions sub-panel === */}
                          {settingsPanel === 'captions' && (
                            <div>
                              <button
                                onClick={() => setSettingsPanel('main')}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white/60 hover:bg-white/5 border-b border-white/5"
                              >
                                <ChevronDown className="w-4 h-4 rotate-90" /> Subtitles/CC
                              </button>
                              <div className="py-1 max-h-56 overflow-y-auto scrollbar-hide">
                                <button
                                  onClick={() => {
                                    handleToggleCaptions();
                                  }}
                                  className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-white/5 transition-colors ${!captionsEnabled ? 'text-purple-400' : 'text-white/70'}`}
                                >
                                  Off
                                  {!captionsEnabled && <Check className="w-4 h-4" />}
                                </button>
                                {captionTracks.map((t) => (
                                  <button
                                    key={t.lang}
                                    onClick={() => handleSetCaptionLang(t.lang)}
                                    className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-white/5 transition-colors ${captionsEnabled && currentCaptionLang === t.lang ? 'text-purple-400' : 'text-white/70'}`}
                                  >
                                    {t.name}
                                    {captionsEnabled && currentCaptionLang === t.lang && (
                                      <Check className="w-4 h-4" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* PiP (desktop) */}
                  <button
                    onClick={handlePiP}
                    className="text-white/60 hover:text-white transition-colors p-1 hidden md:block"
                    title="Picture-in-picture"
                  >
                    <PictureInPicture2 className="w-[16px] h-[16px]" />
                  </button>

                  {/* Theater toggle */}
                  <button
                    onClick={() => setIsTheaterMode(!isTheaterMode)}
                    className="text-white/60 hover:text-white transition-colors p-1 hidden md:block"
                    title="Theater mode"
                  >
                    {isTheaterMode ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </button>

                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreenMode}
                    className="text-white/60 hover:text-white transition-colors p-1"
                    title="Fullscreen (F)"
                  >
                    <Maximize2 className="w-[18px] h-[18px]" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Keyboard hints */}
            <AnimatePresence>
              {showControls && !isPlaying && playerReady && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-16 left-0 right-0 flex justify-center gap-3 z-10 pointer-events-none"
                >
                  {[
                    ['Space', 'Play'],
                    ['F', 'Fullscreen'],
                    ['M', 'Mute'],
                    ['C', 'Captions'],
                    ['J/L', '±10s'],
                    ['</>', 'Speed'],
                  ].map(([key, label]) => (
                    <span key={key} className="text-white/15 text-[10px] flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[9px]">{key}</kbd>
                      {label}
                    </span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Video Info */}
          <div className="mt-4 space-y-4">
            {/* Title */}
            <h1 className="text-xl lg:text-2xl font-bold text-white leading-tight">{title}</h1>

            {/* Stats row */}
            {ytInfo && (
              <div className="flex items-center gap-4 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {ytInfo.viewCount} views
                </span>
                <span>
                  {new Date(ytInfo.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Channel info */}
              {(channel || ytInfo) && (
                <div className="flex items-center gap-3 mr-auto">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {channel?.thumbnailUrl ? (
                      <img
                        src={channel.thumbnailUrl}
                        alt={channelName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-sm">{channelName.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{channelName}</p>
                    <p className="text-xs text-white/40">
                      {getDisplaySubscriberCount(
                        channel?.youtubeChannelId || ytInfo?.channelId || '',
                        channel?.subscriberCount || '0'
                      )}{' '}
                      subscribers
                    </p>
                  </div>
                    {channel && (
                      <>
                        <a
                          href={`https://www.youtube.com/watch?v=${ytId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-full transition-colors flex items-center gap-1.5"
                        >
                          <Share2 className="w-3.5 h-3.5" /> Watch on YouTube
                        </a>
                        <ChannelSubscribeButton
                          channelId={channel.youtubeChannelId}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-full transition-colors flex items-center gap-1.5 disabled:cursor-default disabled:opacity-100"
                          subscribedClassName="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-full transition-colors flex items-center gap-1.5 cursor-default"
                          iconClassName="w-3.5 h-3.5"
                        />
                      </>
                    )}
                </div>
              )}

              {/* Action buttons — Like / Dislike / Share / Theater */}
              <div className="flex items-center gap-2">
                {/* Like */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleLike}
                  className={`px-3 py-2 rounded-xl text-sm flex items-center gap-1.5 transition-all border ${
                    liked
                      ? 'bg-purple-600/20 border-purple-500/30 text-purple-300'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-purple-400' : ''}`} />
                  {ytInfo?.likeCount || 'Like'}
                </motion.button>

                {/* Share */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white text-sm flex items-center gap-1.5 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleToggleSave}
                  className={`px-3 py-2 rounded-xl text-sm flex items-center gap-1.5 transition-all border ${
                    saved
                      ? 'bg-cyan-500/15 border-cyan-400/30 text-cyan-200'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${saved ? 'fill-cyan-300' : ''}`} />
                  {saved ? 'Saved' : 'Save'}
                </motion.button>
              </div>
            </div>

            {/* Batch & Subject info */}
            {batch && (
              <div className="flex items-center gap-2 text-sm">
                <span className="px-3 py-1 bg-purple-500/10 text-purple-300 rounded-lg border border-purple-500/10 text-xs font-medium">
                  {batch.name}
                </span>
                {video.subject && (
                  <span className="px-3 py-1 bg-pink-500/10 text-pink-300 rounded-lg border border-pink-500/10 text-xs font-medium">
                    {video.subject}
                  </span>
                )}
              </div>
            )}

            {/* Tags */}
            {ytInfo && ytInfo.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {ytInfo.tags.slice(0, 10).map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-white/5 border border-white/5 rounded-md text-[10px] text-white/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="bg-[#0f0a1f]/60 border border-purple-500/10 rounded-xl p-4">
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors w-full"
              >
                <BookOpen className="w-4 h-4" />
                <span className="font-medium">Description</span>
                {ytInfoLoading && <Loader2 className="w-3 h-3 animate-spin text-white/30" />}
                {showDescription ? (
                  <ChevronUp className="w-4 h-4 ml-auto" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-auto" />
                )}
              </button>
              <AnimatePresence>
                {showDescription && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-3 text-sm text-white/50 whitespace-pre-wrap leading-relaxed">
                      {description || 'No description available.'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ========== Sidebar ========== */}
        <div className={`${isTheaterMode ? 'max-w-2xl mx-auto w-full' : 'lg:col-span-1'}`}>
          <div className="bg-[#0f0a1f]/60 border border-purple-500/10 rounded-2xl overflow-hidden sticky top-20">
            {/* Tabs */}
            <div className="flex border-b border-purple-500/10">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-3 py-3 text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                      activeTab === tab.id
                        ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/5'
                        : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                    {tab.id === 'chat' && isLive && (
                      <span className="relative flex h-2 w-2 ml-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="h-[500px] lg:h-[calc(100vh-200px)] overflow-hidden">
              {/* ===== Notes Tab ===== */}
              {activeTab === 'notes' && (
                <div className="h-full flex flex-col">
                  <>
                    {!isAuthenticated && (
                      <div className="p-3 text-xs text-white/40 border-b border-purple-500/10">
                        Notes are stored locally in your browser. Sign in to sync across devices.
                      </div>
                    )}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                        
                        {notes.length === 0 ? (
                          <div className="text-center py-12">
                            <StickyNote className="w-12 h-12 text-white/10 mx-auto mb-3" />
                            <p className="text-white/30 text-sm">No notes yet</p>
                            <p className="text-white/20 text-xs mt-1">
                              Start taking notes while watching
                            </p>
                          </div>
                        ) : (
                          notes
                            .sort((a, b) => a.timestamp - b.timestamp)
                            .map((note) => (
                              <motion.div
                                key={note.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#1a1035]/60 border border-purple-500/10 rounded-xl p-3 group cursor-pointer"
                                onClick={() => seekTo(note.timestamp)}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-xs text-purple-400 font-mono bg-purple-500/10 px-2 py-0.5 rounded-md">
                                    <Clock className="w-3 h-3 inline mr-1" />
                                    {formatTimestamp(note.timestamp)}
                                  </span>
                                  <div className="flex items-center gap-2">
                                                                        <button
                                      onClick={() => deleteNote(note.id)}
                                      className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* show handwritten image if present */}
                                <p className="text-sm text-white/70 leading-relaxed mt-2">{note.content}</p>                              </motion.div>
                            ))
                        )}
                      </div>
                      <div className="p-4 border-t border-purple-500/10">
                        <div className="flex gap-2 flex-nowrap">
                          <input
                            ref={timestampInputRef}
                            type="text"
                            value={noteTimestamp}
                            onChange={(e) => setNoteTimestamp(e.target.value)}
                            placeholder="Timestamp (e.g. 1:23)"
                            className="w-24 bg-[#1a1035] border border-purple-500/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500/30 transition-colors"
                          />
                          <input
                            type="text"
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            onFocus={() => {
                              if (isPlaying) {
                                ytPlayerRef.current?.pauseVideo?.();
                                setIsPlaying(false);
                              }
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                            placeholder="Add a note..."
                            className="flex-1 bg-[#1a1035] border border-purple-500/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500/30 transition-colors"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddNote}
                            className="flex-shrink-0 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white text-sm font-medium"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleAutoGenerateNotes}
                            disabled={aiLoading}
                            className={`px-3 py-2 rounded-xl text-sm font-medium border border-white/10 ml-2 flex items-center gap-2 ${
                              aiLoading ? 'bg-white/5 text-white/50' : 'text-white/70 hover:text-white/90'
                            }`}
                          >
                            {aiLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                            ) : (
                              'Auto Notes (AI)'
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </>
                </div>
              )}

              {/* ===== Comments Tab ===== */}
              {activeTab === 'comments' && (
                <div className="h-full flex flex-col">
                  {commentsDisabled ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center p-6">
                        <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-3" />
                        <p className="text-white/40 text-sm">
                          Comments are disabled for this video
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                      {comments.map((c) => (
                        <motion.div
                          key={c.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2"
                        >
                          {/* Top level comment */}
                          <div className="flex gap-3">
                            <img
                              src={c.authorImage}
                              alt=""
                              className="w-8 h-8 rounded-full flex-shrink-0 bg-white/10"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-white/80">
                                  {c.authorName}
                                </span>
                                <span className="text-[10px] text-white/25">{c.timeAgo}</span>
                              </div>
                              <p className="text-sm text-white/60 mt-1 leading-relaxed whitespace-pre-wrap break-words">
                                {c.text}
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                <button className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/50 transition-colors">
                                  <ThumbsUp className="w-3 h-3" /> {c.likeCount}
                                </button>

                                {c.replyCount > 0 && (
                                  <button
                                    onClick={() => toggleReplies(c.id)}
                                    className="text-[10px] text-purple-400 hover:text-purple-300 font-medium transition-colors"
                                  >
                                    {expandedReplies.has(c.id) ? 'Hide' : `${c.replyCount}`}{' '}
                                    {c.replyCount === 1 ? 'reply' : 'replies'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Replies */}
                          <AnimatePresence>
                            {expandedReplies.has(c.id) && c.replies.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-11 space-y-3 pt-1">
                                  {c.replies.map((r) => (
                                    <div key={r.id} className="flex gap-2.5">
                                      <img
                                        src={r.authorImage}
                                        alt=""
                                        className="w-6 h-6 rounded-full flex-shrink-0 bg-white/10"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-semibold text-white/70">
                                            {r.authorName}
                                          </span>
                                          <span className="text-[9px] text-white/20">
                                            {r.timeAgo}
                                          </span>
                                        </div>
                                        <p className="text-xs text-white/50 mt-0.5 leading-relaxed whitespace-pre-wrap break-words">
                                          {r.text}
                                        </p>
                                        <button className="flex items-center gap-1 mt-1 text-[9px] text-white/25 hover:text-white/40 transition-colors">
                                          <ThumbsUp className="w-2.5 h-2.5" /> {r.likeCount}
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}

                      {/* Load more */}
                      {commentsLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                        </div>
                      ) : nextPageToken ? (
                        <button
                          onClick={() => fetchComments(nextPageToken)}
                          className="w-full py-3 text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
                        >
                          Load more comments
                        </button>
                      ) : comments.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center">
                            <MessageSquare className="w-10 h-10 text-white/10 mx-auto mb-2" />
                            <p className="text-white/30 text-xs">No comments yet</p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              )}

              {/* ===== Live Chat Tab ===== */}
              {activeTab === 'chat' && isLive && (
                <div className="h-full">
                  <iframe src={liveChatUrl} className="w-full h-full border-0" title="Live Chat" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
