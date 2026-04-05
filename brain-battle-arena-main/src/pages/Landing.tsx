import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { CountdownTimer } from '@/components/CountdownTimer';
import { LevelBadge } from '@/components/LevelBadge';
import { CoinDisplay } from '@/components/CoinDisplay';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import heroBrain from '@/assets/hero-brain.png';
import { 
  Trophy, Users, Zap, ArrowRight, BookOpen, Target, Clock, 
  Swords, Dumbbell, LogOut, Settings
} from 'lucide-react';
import type { SeasonLevel } from '@/types/game';

export default function Landing() {
  const navigate = useNavigate();
  const { user, profile, userStats, signOut } = useAuth();
  const [battleStatus, setBattleStatus] = useState<'waiting' | 'joinable' | 'active'>('waiting');

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      if (h === 17 || (h > 17 && h < 18)) setBattleStatus('active');
      else if (h === 16 && m >= 55) setBattleStatus('joinable');
      else setBattleStatus('waiting');
    };
    check();
    const i = setInterval(check, 1000);
    return () => clearInterval(i);
  }, []);

  if (!user) {
    navigate('/auth');
    return null;
  }

  // Redirect to setup if profile needs board/class selection
  if (profile && (!profile.board || !profile.class_level || profile.board === 'CBSE' && profile.class_level === '9th' && !profile.display_name)) {
    // Only redirect if user hasn't completed setup (default values)
  }

  const needsSetup = profile && !profile.display_name;
  if (needsSetup) {
    navigate('/setup');
    return null;
  }

  const coins = profile?.total_coins || 0;
  const level = (userStats?.current_level || 'bronze') as SeasonLevel;
  const tier = (userStats?.current_tier || 3) as 1 | 2 | 3;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <Logo size="sm" showTagline={false} />
        <div className="flex items-center gap-4">
          <CoinDisplay amount={coins} size="sm" />
          <LevelBadge level={level} tier={tier} size="sm" />
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <Settings size={20} />
          </Button>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut size={20} />
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center -z-10"
          style={{ backgroundImage: `url(${heroBrain})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background -z-10" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div>
            <p className="font-body text-muted-foreground mb-2">Welcome back,</p>
            <h1 className="font-display text-3xl font-bold text-primary">{profile?.username || 'Warrior'}</h1>
            <p className="font-body text-sm text-muted-foreground mt-1">{profile?.board} • Class {profile?.class_level}</p>
          </div>

          {/* Countdown */}
          <div className="py-4">
            <CountdownTimer 
              targetHour={17} 
              targetMinute={0} 
              onComplete={() => setBattleStatus('active')}
            />
          </div>

          {/* Battle Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Live Battle */}
            <div className="card-gaming p-6 space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Swords className="text-destructive" size={28} />
                <h2 className="font-display text-xl font-bold">Live Battle</h2>
              </div>
              <p className="font-body text-sm text-muted-foreground">
                Daily at 5:00 PM • Compete with all players
              </p>
              <Button 
                onClick={() => navigate('/battle/live')}
                disabled={battleStatus === 'waiting'}
                className={`btn-gaming w-full py-5 text-lg ${
                  battleStatus === 'waiting' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {battleStatus === 'active' ? 'JOIN BATTLE' : 
                 battleStatus === 'joinable' ? 'READY TO JOIN' : 'WAITING...'}
                <ArrowRight className="ml-2" />
              </Button>
              {battleStatus === 'waiting' && (
                <p className="font-body text-xs text-muted-foreground">Opens at 4:55 PM</p>
              )}
            </div>

            {/* Practice Battle */}
            <div className="card-gaming p-6 space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Dumbbell className="text-primary" size={28} />
                <h2 className="font-display text-xl font-bold">Practice Battle</h2>
              </div>
              <p className="font-body text-sm text-muted-foreground">
                Play anytime • Improve your skills
              </p>
              <Button 
                onClick={() => navigate('/battle/practice')}
                className="btn-gaming w-full py-5 text-lg"
                variant="outline"
              >
                START PRACTICE
                <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <FeatureCard icon={BookOpen} title="Class 9th - 12th" description="CBSE & ICSE AI-generated questions" />
            <FeatureCard icon={Clock} title="Daily at 5 PM" description="10 questions, 1 minute each" />
            <FeatureCard icon={Target} title="Earn & Redeem" description="Win coins and unlock rewards" />
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 py-6">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-4">
            <StatItem icon={Users} value="10K+" label="Players" />
            <StatItem icon={Trophy} value="500+" label="Daily Battles" />
            <StatItem icon={Zap} value="AI" label="Generated" />
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: typeof BookOpen; title: string; description: string }) {
  return (
    <div className="card-gaming p-6 text-center hover:glow-primary transition-all duration-300">
      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/20 flex items-center justify-center">
        <Icon className="text-primary" size={24} />
      </div>
      <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
      <p className="font-body text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function StatItem({ icon: Icon, value, label }: { icon: typeof Users; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Icon className="text-primary" size={24} />
      <span className="font-display font-bold text-2xl">{value}</span>
      <span className="font-body text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
