import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetHour: number;
  targetMinute: number;
  onComplete?: () => void;
}

export function CountdownTimer({ targetHour, targetMinute, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(targetHour, targetMinute, 0, 0);

      // If target time has passed today, set for tomorrow
      if (now > target) {
        target.setDate(target.getDate() + 1);
      }

      const diff = target.getTime() - now.getTime();
      
      if (diff <= 0) {
        setIsLive(true);
        onComplete?.();
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetHour, targetMinute, onComplete]);

  if (isLive) {
    return (
      <div className="flex items-center gap-3 px-6 py-3 bg-success/20 border border-success/50 rounded-xl">
        <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
        <span className="font-display font-bold text-success text-xl">LIVE NOW</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock size={20} />
        <span className="font-body text-sm uppercase tracking-wider">Next Battle Starts In</span>
      </div>
      <div className="flex items-center gap-4">
        <TimeBlock value={timeLeft.hours} label="Hours" />
        <span className="countdown-digit text-primary">:</span>
        <TimeBlock value={timeLeft.minutes} label="Min" />
        <span className="countdown-digit text-primary">:</span>
        <TimeBlock value={timeLeft.seconds} label="Sec" />
      </div>
    </div>
  );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="card-gaming px-4 py-3 min-w-[80px] glow-primary">
        <span className="countdown-digit text-primary">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="font-body text-xs text-muted-foreground mt-2 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
