'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  ChevronUp,
  ChevronDown,
  X,
  Loader2,
  Eye,
  Music2,
  Heart,
  Send,
  ChevronDown as ExpandIcon,
  Volume2,
  VolumeX,
  ArrowLeft,
  Play,
  Pause,
} from 'lucide-react';
import Link from 'next/link';
import { loadYouTubeIFrameAPI } from '@/lib/youtubePlayer';

// ---------- Types ----------
interface ShortItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  viewCount: string;
  likeCount: string;
  publishedAt: string;
  channelTitle?: string;
  channelId?: string;
}

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
  shorts: ShortItem[];
  initialIndex?: number;
  onClose?: () => void;
  showBackButton?: boolean;
  backHref?: string;
  apiKey?: string;
}

// ---------- Helpers ----------
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

// =================================================================
export default function ShortsPlayer({
  shorts,
  initialIndex = 0,
  onClose,
  showBackButton = true,
  backHref,
  apiKey,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0); // -1 up, 1 down
  const [showComments, setShowComments] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [muted, setMuted] = useState(false);

  // YouTube fetched info
  const [videoInfo, setVideoInfo] = useState<YTVideoInfo | null>(null);
  const [comments, setComments] = useState<YTComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsDisabled, setCommentsDisabled] = useState(false);
  const [commentsNextPage, setCommentsNextPage] = useState<string | null>(null);
  const [infoLoading, setInfoLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  // ---- Custom YouTube player state ----
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const shortsPlayerRef = useRef<any>(null);
  const shortsPlayerDivRef = useRef<HTMLDivElement>(null);
  const prevShortIdRef = useRef<string | null>(null);
  const [shortIsPlaying, setShortIsPlaying] = useState(true);
  const [shortProgress, setShortProgress] = useState(0);
  const [shortDuration, setShortDuration] = useState(0);
  const [shortPlayerReady, setShortPlayerReady] = useState(false);
  const [showTapIndicator, setShowTapIndicator] = useState<'play' | 'pause' | null>(null);
  const shortPollerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [likedShortIds, setLikedShortIds] = useState<Record<string, boolean>>({});

  const currentShort = shorts[currentIndex];
  const liked = !!(currentShort && likedShortIds[currentShort.id]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('pw-studyverse-short-likes');
      setLikedShortIds(stored ? JSON.parse(stored) : {});
    } catch {
      setLikedShortIds({});
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('pw-studyverse-short-likes', JSON.stringify(likedShortIds));
    } catch {
      /* ignore */
    }
  }, [likedShortIds]);

  // ---- Fetch video info ----
  const fetchVideoInfo = useCallback(async (videoId: string) => {
    if (!apiKey) return;
    setInfoLoading(true);
    setVideoInfo(null);
    setComments([]);
    setCommentsNextPage(null);
    setCommentsDisabled(false);
    try {
      const res = await fetch('/api/youtube/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId, apiKey }),
      });
      if (res.ok) {
        const data = await res.json();
        setVideoInfo(data);
      }
    } catch {
      /* ignore */
    }
    setInfoLoading(false);
  }, [apiKey]);

  // ---- Fetch comments ----
  const fetchComments = useCallback(async (videoId: string, pageToken?: string) => {
    if (!apiKey) return;
    setCommentsLoading(true);
    try {
      const res = await fetch('/api/youtube/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId, apiKey, pageToken }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.disabled) {
          setCommentsDisabled(true);
        } else {
          setComments((prev) => (pageToken ? [...prev, ...data.comments] : data.comments));
          setCommentsNextPage(data.nextPageToken || null);
        }
      }
    } catch {
      /* ignore */
    }
    setCommentsLoading(false);
  }, [apiKey]);

  // Fetch info when short changes
  useEffect(() => {
    if (currentShort) {
      fetchVideoInfo(currentShort.id);
    }
  }, [currentShort, fetchVideoInfo]);

  // ===== YouTube IFrame Player for Shorts =====
  useEffect(() => {
    let player: any = null;
    let poller: ReturnType<typeof setInterval> | null = null;
    let mounted = true;

    const init = async () => {
      await loadYouTubeIFrameAPI();
      if (!mounted || !shortsPlayerDivRef.current) return;

      const el = document.createElement('div');
      shortsPlayerDivRef.current.innerHTML = '';
      shortsPlayerDivRef.current.appendChild(el);

        player = new (window as any).YT.Player(el, {
          videoId: currentShort?.id,
          playerVars: {
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            disablekb: 0,
            fs: 1,
            playsinline: 1,
          enablejsapi: 1,
          loop: 1,
          playlist: currentShort?.id,
          cc_load_policy: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (e: any) => {
            if (!mounted) return;
            shortsPlayerRef.current = e.target;
            setShortPlayerReady(true);
            setShortDuration(e.target.getDuration() || 0);
            if (muted) e.target.mute();
            prevShortIdRef.current = currentShort?.id || null;
            poller = setInterval(() => {
              if (!shortsPlayerRef.current) return;
              setShortProgress(shortsPlayerRef.current.getCurrentTime());
              const d = shortsPlayerRef.current.getDuration();
              if (d > 0) setShortDuration(d);
            }, 200);
            shortPollerRef.current = poller;
          },
          onStateChange: (e: any) => {
            if (!mounted) return;
            setShortIsPlaying(e.data === 1);
            // Loop manually if ended
            if (e.data === 0 && shortsPlayerRef.current) {
              shortsPlayerRef.current.seekTo(0, true);
              shortsPlayerRef.current.playVideo();
            }
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
      shortsPlayerRef.current = null;
      setShortPlayerReady(false);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load new video when short changes (without re-creating player)
  useEffect(() => {
    if (!shortsPlayerRef.current || !shortPlayerReady || !currentShort) return;
    if (prevShortIdRef.current && prevShortIdRef.current !== currentShort.id) {
      shortsPlayerRef.current.loadVideoById({ videoId: currentShort.id });
      setShortProgress(0);
      setShortIsPlaying(true);
      prevShortIdRef.current = currentShort.id;
    }
  }, [currentShort?.id, shortPlayerReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // Tap to toggle play/pause
  const handleTapToggle = useCallback(() => {
    if (!shortsPlayerRef.current) return;
    const willPlay = !shortIsPlaying;
    if (willPlay) shortsPlayerRef.current.playVideo();
    else shortsPlayerRef.current.pauseVideo();
    setShowTapIndicator(willPlay ? 'play' : 'pause');
    setTimeout(() => setShowTapIndicator(null), 500);
  }, [shortIsPlaying]);

  // Mute/unmute via API
  const handleToggleMute = useCallback(() => {
    if (shortsPlayerRef.current) {
      if (muted) shortsPlayerRef.current.unMute();
      else shortsPlayerRef.current.mute();
    }
    setMuted(!muted);
  }, [muted]);

  // ---- Navigation ----
  const goNext = useCallback(() => {
    if (currentIndex < shorts.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
      setShowComments(false);
      setShowDescription(false);
    }
  }, [currentIndex, shorts.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
      setShowComments(false);
      setShowDescription(false);
    }
  }, [currentIndex]);

  // ---- Keyboard navigation ----
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (showComments) return;
      if (e.key === 'ArrowDown' || e.key === 'j') goNext();
      else if (e.key === 'ArrowUp' || e.key === 'k') goPrev();
      else if (e.key === 'Escape') {
        if (showComments) setShowComments(false);
        else if (onClose) onClose();
      } else if (e.key === 'm') handleToggleMute();
      else if (e.key === ' ') {
        e.preventDefault();
        handleTapToggle();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev, onClose, showComments, handleToggleMute, handleTapToggle]);

  // ---- Touch/scroll navigation ----
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndY.current = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY.current;
    if (Math.abs(diff) > 60) {
      if (diff > 0)
        goNext(); // swipe up → next
      else goPrev(); // swipe down → prev
    } else {
      // Tap — toggle play/pause
      handleTapToggle();
    }
  };

  // ---- Wheel navigation ----
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (showComments) return;
      if (wheelTimeout.current) return; // throttle
      if (Math.abs(e.deltaY) > 30) {
        if (e.deltaY > 0) goNext();
        else goPrev();
        wheelTimeout.current = setTimeout(() => {
          wheelTimeout.current = null;
        }, 600);
      }
    },
    [goNext, goPrev, showComments]
  );

  // ---- Share ----
  const handleShare = async () => {
    const url = `${window.location.origin}/shorts/${currentShort.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: currentShort.title, url });
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  // Open comments
  const handleOpenComments = () => {
    setShowComments(true);
    if (comments.length === 0 && !commentsDisabled) {
      fetchComments(currentShort.id);
    }
  };

  if (!currentShort) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p>No shorts available</p>
      </div>
    );
  }

  // ---- Slide variants ----
  const slideVariants = {
    enter: (d: number) => ({ y: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (d: number) => ({ y: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-3">
          {showBackButton &&
            (backHref ? (
              <Link
                href={backHref}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
            ) : onClose ? (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            ) : (
              <Link href="/shorts" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
            ))}
          <h1 className="text-white font-bold text-lg">Shorts</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-xs">
            {currentIndex + 1} / {shorts.length}
          </span>
        </div>
      </div>

      {/* Main content area */}
      <div className="relative flex items-center justify-center h-full w-full max-w-[480px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentShort.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Video container */}
            <div className="relative w-full h-full max-h-[calc(100vh-24px)] flex items-center justify-center">
              <div className="relative w-full" style={{ aspectRatio: '9/16', maxHeight: '100%' }}>
                {/* Custom YouTube player */}
                <div
                  ref={shortsPlayerDivRef}
                  className="shorts-player-wrapper absolute inset-0 w-full h-full rounded-xl overflow-hidden"
                />

                 {/* Passive layer only; must not block the YouTube player UI */}
                  <div
                    className="absolute inset-0 z-[5] rounded-xl pointer-events-none"
                  />

                {/* Tap play/pause indicator */}
                <AnimatePresence>
                  {showTapIndicator && (
                    <motion.div
                      key={showTapIndicator}
                      initial={{ opacity: 0.9, scale: 0.8 }}
                      animate={{ opacity: 0, scale: 1.3 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 z-[6] flex items-center justify-center pointer-events-none"
                    >
                      <div className="w-14 h-14 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                        {showTapIndicator === 'play' ? (
                          <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                        ) : (
                          <Pause className="w-6 h-6 text-white fill-white" />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Thin progress bar at bottom */}
                <div className="absolute bottom-0 left-0 right-0 z-[7] h-[3px] bg-white/10 rounded-b-xl overflow-hidden pointer-events-none">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200"
                    style={{
                      width: `${shortDuration ? (shortProgress / shortDuration) * 100 : 0}%`,
                    }}
                  />
                </div>

                {/* Loading overlay */}
                {!shortPlayerReady && (
                  <div className="absolute inset-0 z-[8] flex items-center justify-center bg-black/50 rounded-xl">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                  </div>
                )}

                {/* Bottom overlay - video info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-b-xl pointer-events-auto z-10">
                  {/* Channel */}
                  {(videoInfo?.channelTitle || currentShort.channelTitle) && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                        {(videoInfo?.channelTitle || currentShort.channelTitle || '?')[0]}
                      </div>
                      <span className="text-white font-semibold text-sm">
                        {videoInfo?.channelTitle || currentShort.channelTitle}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <p className="text-white text-sm font-medium leading-snug line-clamp-2 mb-1">
                    {videoInfo?.title || currentShort.title}
                  </p>

                  {/* Description toggle */}
                  {videoInfo?.description && (
                    <button
                      onClick={() => setShowDescription(!showDescription)}
                      className="text-white/50 text-xs flex items-center gap-1 hover:text-white/80 transition-colors"
                    >
                      {showDescription ? 'Show less' : 'Show more'}
                      <ChevronDown
                        className={`w-3 h-3 transition-transform ${showDescription ? 'rotate-180' : ''}`}
                      />
                    </button>
                  )}

                  {/* Expanded description */}
                  <AnimatePresence>
                    {showDescription && videoInfo?.description && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-white/60 text-xs mt-2 whitespace-pre-line leading-relaxed max-h-32 overflow-y-auto scrollbar-hide">
                          {videoInfo.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Music / audio indicator */}
                  <div className="flex items-center gap-2 mt-2">
                    <Music2 className="w-3 h-3 text-white/40" />
                    <div className="overflow-hidden flex-1">
                      <p className="text-white/40 text-[10px] whitespace-nowrap animate-marquee">
                        {videoInfo?.title || currentShort.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Side action buttons */}
        <div className="absolute right-[-60px] md:right-[-70px] bottom-1/3 flex flex-col items-center gap-5 z-20">
          {/* Like */}
          <button
            onClick={() =>
              setLikedShortIds((prev) => ({
                ...prev,
                [currentShort.id]: !prev[currentShort.id],
              }))
            }
            className="flex flex-col items-center gap-1 group"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all
              ${liked ? 'bg-purple-500/30 text-purple-400' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <ThumbsUp className={`w-5 h-5 ${liked ? 'fill-purple-400' : ''}`} />
            </div>
            <span className="text-white/70 text-[10px] font-medium">
              {videoInfo?.likeCount || currentShort.likeCount || '—'}
            </span>
          </button>

          {/* Comments */}
          <button onClick={handleOpenComments} className="flex flex-col items-center gap-1 group">
            <div className="w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all text-white">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-white/70 text-[10px] font-medium">
              {videoInfo?.commentCount || '—'}
            </span>
          </button>

          {/* Share */}
          <button onClick={handleShare} className="flex flex-col items-center gap-1 group">
            <div className="w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all text-white">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-white/70 text-[10px] font-medium">Share</span>
          </button>

          {/* Mute toggle */}
          <button onClick={handleToggleMute} className="flex flex-col items-center gap-1 group">
            <div className="w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all text-white">
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </div>
            <span className="text-white/70 text-[10px] font-medium">
              {muted ? 'Unmute' : 'Mute'}
            </span>
          </button>
        </div>
      </div>

      {/* Navigation buttons (right side) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20 hidden md:flex">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="p-3 bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed rounded-full text-white transition-all backdrop-blur-sm"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={goNext}
          disabled={currentIndex === shorts.length - 1}
          className="p-3 bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed rounded-full text-white transition-all backdrop-blur-sm"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Loading indicator */}
      {infoLoading && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30">
          <Loader2 className="w-5 h-5 text-white/50 animate-spin" />
        </div>
      )}

      {/* Comments Panel (slide up from bottom) */}
      <AnimatePresence>
        {showComments && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowComments(false)}
              className="absolute inset-0 bg-black/50 z-40"
            />

            {/* Comments sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 z-50 bg-[#1a1035] rounded-t-3xl max-h-[70vh] flex flex-col"
            >
              {/* Handle + Header */}
              <div className="flex-shrink-0 pt-3 pb-2 px-5 border-b border-white/5">
                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-3" />
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold text-base">
                    Comments {videoInfo?.commentCount ? `(${videoInfo.commentCount})` : ''}
                  </h3>
                  <button
                    onClick={() => setShowComments(false)}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-white/60" />
                  </button>
                </div>
              </div>

              {/* Comments list */}
              <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4 scrollbar-hide">
                {commentsDisabled ? (
                  <p className="text-white/30 text-sm text-center py-8">
                    Comments are turned off for this video
                  </p>
                ) : commentsLoading && comments.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-white/30 text-sm text-center py-8">No comments yet</p>
                ) : (
                  <>
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <img
                          src={comment.authorImage}
                          alt=""
                          className="w-8 h-8 rounded-full flex-shrink-0 object-cover bg-purple-500/20"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '';
                            (e.target as HTMLImageElement).className =
                              'w-8 h-8 rounded-full flex-shrink-0 bg-purple-500/20';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-medium text-white/70">
                              {comment.authorName}
                            </span>
                            <span className="text-[10px] text-white/30">{comment.timeAgo}</span>
                          </div>
                          <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line break-words">
                            {comment.text}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="flex items-center gap-1 text-[10px] text-white/30">
                              <ThumbsUp className="w-3 h-3" /> {comment.likeCount}
                            </span>
                            {comment.replyCount > 0 && (
                              <span className="text-[10px] text-purple-400">
                                {comment.replyCount}{' '}
                                {comment.replyCount === 1 ? 'reply' : 'replies'}
                              </span>
                            )}
                          </div>

                          {/* Replies */}
                          {comment.replies?.length > 0 && (
                            <div className="mt-2 ml-2 space-y-2.5 border-l border-white/5 pl-3">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex gap-2">
                                  <img
                                    src={reply.authorImage}
                                    alt=""
                                    className="w-6 h-6 rounded-full flex-shrink-0 bg-purple-500/20"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).className =
                                        'w-6 h-6 rounded-full flex-shrink-0 bg-purple-500/20';
                                    }}
                                  />
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] font-medium text-white/60">
                                        {reply.authorName}
                                      </span>
                                      <span className="text-[9px] text-white/25">
                                        {reply.timeAgo}
                                      </span>
                                    </div>
                                    <p className="text-xs text-white/70 leading-relaxed mt-0.5">
                                      {reply.text}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Load more */}
                    {commentsNextPage && (
                      <button
                        onClick={() => fetchComments(currentShort.id, commentsNextPage)}
                        disabled={commentsLoading}
                        className="w-full py-3 text-sm text-purple-400 hover:text-purple-300 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                      >
                        {commentsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Load more comments
                      </button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Keyboard hints (desktop only) */}
      <div className="absolute bottom-4 left-4 hidden md:flex items-center gap-3 z-20">
        <span className="text-white/15 text-[10px] flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[9px]">↑</kbd>
          <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[9px]">↓</kbd>
          Navigate
        </span>
        <span className="text-white/15 text-[10px] flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[9px]">M</kbd>
          Mute
        </span>
        <span className="text-white/15 text-[10px] flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[9px]">Esc</kbd>
          Back
        </span>
      </div>
    </div>
  );
}
