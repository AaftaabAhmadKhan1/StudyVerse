import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/Logo';
import { LevelBadge } from '@/components/LevelBadge';
import { CoinDisplay } from '@/components/CoinDisplay';
import { Button } from '@/components/ui/button';
import type { SeasonLevel } from '@/types/game';
import { 
  Target, CheckCircle2, XCircle, Zap, Trophy, Medal, Star,
  Clock, ArrowLeft, Coins, TrendingUp, Dumbbell
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { profile, userStats } = useAuth();

  const stats = userStats;
  const coins = profile?.total_coins || 0;
  const level = (stats?.current_level || 'bronze') as SeasonLevel;
  const tier = (stats?.current_tier || 3) as 1 | 2 | 3;
  const totalQ = stats?.total_questions || 0;
  const correctA = stats?.correct_answers || 0;
  const wrongA = stats?.wrong_answers || 0;
  const accuracy = totalQ > 0 ? Math.round((correctA / totalQ) * 100) : 0;
  const progressPct = ((10 - (stats?.questions_to_next_tier || 10)) / 10) * 100;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft size={20} /> Back
          </Button>
          <Logo size="sm" showTagline={false} />
          <CoinDisplay amount={coins} size="sm" />
        </div>

        <div className="text-center animate-fade-in">
          <h1 className="font-display text-3xl font-bold">Your Dashboard</h1>
          <p className="font-body text-muted-foreground mt-2">Track your progress and achievements</p>
        </div>

        {/* Current Level */}
        <div className="card-gaming p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <TrendingUp className="text-primary" /> Current Season
            </h2>
            <LevelBadge level={level} tier={tier} size="lg" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-body text-muted-foreground">Progress to next tier</span>
              <span className="font-display font-bold">{10 - (stats?.questions_to_next_tier || 10)}/10</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
          <StatCard icon={Target} value={totalQ} label="Total Questions" color="text-primary" />
          <StatCard icon={CheckCircle2} value={correctA} label="Correct" color="text-success" />
          <StatCard icon={XCircle} value={wrongA} label="Wrong" color="text-destructive" />
          <StatCard icon={Zap} value={`${accuracy}%`} label="Accuracy" color="text-accent" />
        </div>

        {/* Practice Stats */}
        <div className="card-gaming p-6 animate-fade-in">
          <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <Dumbbell className="text-primary" /> Practice Stats
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-xl">
              <p className="font-display text-2xl font-bold">{stats?.practice_questions || 0}</p>
              <p className="font-body text-xs text-muted-foreground">Practice Questions</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-xl">
              <p className="font-display text-2xl font-bold">{stats?.practice_correct || 0}</p>
              <p className="font-body text-xs text-muted-foreground">Practice Correct</p>
            </div>
          </div>
        </div>

        {/* Speed Stats */}
        <div className="card-gaming p-6 animate-fade-in">
          <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="text-primary" /> Speed Analysis
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <SpeedStat value={stats?.answered_in_5sec || 0} label="Under 5s" icon="⚡" />
            <SpeedStat value={stats?.answered_in_10sec || 0} label="Under 10s" icon="🚀" />
            <SpeedStat value={stats?.answered_in_30sec || 0} label="Under 30s" icon="✨" />
          </div>
        </div>

        {/* Achievements */}
        <div className="card-gaming p-6 animate-fade-in">
          <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="text-gold" /> Achievements
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <AchievementCard icon={Trophy} value={stats?.games_won || 0} label="Games Won" color="text-gold" />
            <AchievementCard icon={Medal} value={stats?.top5_finishes || 0} label="Top 5" color="text-silver" />
            <AchievementCard icon={Star} value={stats?.top10_finishes || 0} label="Top 10" color="text-bronze" />
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={() => navigate('/levels')} variant="outline" className="py-6">
            <TrendingUp className="mr-2" /> Season Levels
          </Button>
          <Button onClick={() => navigate('/shop')} className="btn-gaming py-6">
            <Coins className="mr-2" /> Coin Shop
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color }: { icon: typeof Target; value: number | string; label: string; color: string }) {
  return (
    <div className="stat-card">
      <Icon className={color} size={24} />
      <span className="font-display text-2xl font-bold">{value}</span>
      <span className="font-body text-xs text-muted-foreground text-center">{label}</span>
    </div>
  );
}

function SpeedStat({ value, label, icon }: { value: number; label: string; icon: string }) {
  return (
    <div className="text-center p-4 bg-muted/30 rounded-xl">
      <span className="text-2xl mb-2 block">{icon}</span>
      <span className="font-display text-2xl font-bold block">{value}</span>
      <span className="font-body text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function AchievementCard({ icon: Icon, value, label, color }: { icon: typeof Trophy; value: number; label: string; color: string }) {
  return (
    <div className="text-center p-4 bg-muted/30 rounded-xl">
      <Icon className={`${color} mx-auto mb-2`} size={28} />
      <span className="font-display text-2xl font-bold block">{value}</span>
      <span className="font-body text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
