import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PreBattleVideoProps {
  board: string;
  classLevel: string;
  onComplete: () => void;
}

function getEmbedUrl(url: string): string | null {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=0&controls=0&modestbranding=1`;

  // Google Drive
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;

  // Google Drive folder - can't embed, return null
  if (url.includes('drive.google.com/drive/folders')) return null;

  return url;
}

export function PreBattleVideo({ board, classLevel, onComplete }: PreBattleVideoProps) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { title: `${board} Class ${classLevel}`, subtitle: "Today's Live Battle", emoji: "⚔️", bg: "from-primary/30 to-accent/30" },
    { title: "10 Questions", subtitle: "3 Easy • 4 Medium • 3 Hard", emoji: "🧠", bg: "from-accent/30 to-success/30" },
    { title: "Diamond Questions", subtitle: "Earn 5 coins on special questions!", emoji: "💎", bg: "from-[hsl(var(--diamond))]/30 to-primary/30" },
    { title: "60 Seconds Each", subtitle: "Think fast, answer smart!", emoji: "⏱️", bg: "from-success/30 to-primary/30" },
    { title: "Get Ready!", subtitle: "The battle is about to begin...", emoji: "🚀", bg: "from-primary/30 to-destructive/30" },
  ];

  useEffect(() => {
    const loadVideo = async () => {
      const { data } = await supabase
        .from('battle_videos')
        .select('video_url')
        .eq('board', board)
        .eq('class_level', classLevel)
        .single();

      if (data?.video_url) {
        const embed = getEmbedUrl(data.video_url);
        setVideoUrl(embed);
      }
      setLoading(false);
    };
    loadVideo();
  }, [board, classLevel]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); onComplete(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    if (videoUrl) return; // Don't rotate slides if video is playing
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(slideInterval);
  }, [slides.length, videoUrl]);

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {videoUrl ? (
        <>
          <div className="absolute inset-0 bg-background" />
          <div className="relative z-10 w-full max-w-3xl aspect-video rounded-2xl overflow-hidden border-2 border-primary/30">
            <iframe
              src={videoUrl}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Pre-battle video"
            />
          </div>
          <div className="relative z-10 mt-6 flex items-center justify-center gap-4">
            <div className="px-4 py-2 rounded-full bg-muted/80 backdrop-blur-sm border border-border">
              <span className="font-display text-sm text-muted-foreground">Starting in </span>
              <span className="font-display text-lg font-bold text-primary tabular-nums">{timeLeft}s</span>
            </div>
            <button onClick={onComplete} className="font-body text-sm text-muted-foreground underline hover:text-foreground transition-colors">
              Skip →
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.bg} transition-all duration-1000`} />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="absolute w-2 h-2 rounded-full bg-primary/20 animate-float"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${3 + Math.random() * 4}s` }}
              />
            ))}
          </div>
          <div className="relative z-10 text-center space-y-8 max-w-md w-full">
            <div className="flex items-center justify-center gap-2">
              <div className="px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border">
                <span className="font-display text-sm text-muted-foreground">Starting in </span>
                <span className="font-display text-lg font-bold text-primary tabular-nums">{timeLeft}s</span>
              </div>
            </div>
            <div className="animate-fade-in" key={currentSlide}>
              <div className="text-7xl mb-6 animate-bounce">{slide.emoji}</div>
              <h1 className="font-display text-4xl font-black mb-3">{slide.title}</h1>
              <p className="font-body text-xl text-muted-foreground">{slide.subtitle}</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              {slides.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-primary' : 'bg-muted-foreground/30'}`} />
              ))}
            </div>
            <button onClick={onComplete} className="font-body text-sm text-muted-foreground underline hover:text-foreground transition-colors">
              Skip →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
