import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Diamond, Zap, Target, Shield, Trophy } from 'lucide-react';

interface GameRulesProps {
  onComplete: () => void;
}

export function GameRules({ onComplete }: GameRulesProps) {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onComplete]);

  const rules = [
    { icon: Target, label: "10 Questions", desc: "Answer all 10 to complete the battle", color: "text-primary" },
    { icon: Clock, label: "60 Seconds", desc: "Per question — unanswered = wrong", color: "text-accent" },
    { icon: Diamond, label: "Diamond Q's", desc: "3 special questions worth 5 coins each", color: "text-diamond" },
    { icon: Zap, label: "Speed Matters", desc: "Faster answers = better ranking", color: "text-success" },
    { icon: Shield, label: "No Going Back", desc: "Once submitted, you can't change", color: "text-destructive" },
    { icon: Trophy, label: "Compete Live", desc: "Everyone plays the same questions", color: "text-primary" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-6 animate-fade-in">
        {/* Timer */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border">
            <span className="font-display text-sm text-muted-foreground">Game starts in </span>
            <span className="font-display text-lg font-bold text-primary tabular-nums">{timeLeft}s</span>
          </div>
        </div>

        <h1 className="font-display text-3xl font-black text-center">⚡ Game Rules</h1>

        <div className="grid gap-3">
          {rules.map((rule, i) => (
            <div
              key={i}
              className="card-gaming p-4 flex items-center gap-4 animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-muted ${rule.color}`}>
                <rule.icon size={20} />
              </div>
              <div className="flex-1">
                <p className="font-display font-bold text-sm">{rule.label}</p>
                <p className="font-body text-xs text-muted-foreground">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={onComplete} className="btn-gaming w-full py-6 text-lg">
          I'M READY! 🔥
        </Button>
      </div>
    </div>
  );
}
