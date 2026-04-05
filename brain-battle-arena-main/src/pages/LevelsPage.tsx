import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { LevelBadge } from '@/components/LevelBadge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { seasonLevels } from '@/data/mockData';
import { SeasonLevel } from '@/types/game';
import { ArrowLeft, Lock, CheckCircle2, ChevronRight } from 'lucide-react';

export default function LevelsPage() {
  const navigate = useNavigate();
  const { userStats } = useAuth();
  const currentLevel = (userStats?.current_level || 'bronze') as SeasonLevel;
  const currentTier = (userStats?.current_tier || 3) as 1 | 2 | 3;

  const getLevelStatus = (level: SeasonLevel) => {
    const levelIndex = seasonLevels.findIndex(l => l.level === level);
    const currentIndex = seasonLevels.findIndex(l => l.level === currentLevel);
    if (levelIndex < currentIndex) return 'completed';
    if (levelIndex === currentIndex) return 'current';
    return 'locked';
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
            <ArrowLeft size={20} /> Back
          </Button>
          <Logo size="sm" showTagline={false} />
          <div className="w-20" />
        </div>

        <div className="text-center animate-fade-in">
          <h1 className="font-display text-3xl font-bold">Season Levels</h1>
          <p className="font-body text-muted-foreground mt-2">Complete 30 questions to progress each level</p>
        </div>

        <div className="space-y-4 animate-fade-in">
          {[...seasonLevels].reverse().map((levelData) => {
            const status = getLevelStatus(levelData.level);
            return (
              <div key={levelData.level} className={`card-gaming p-4 transition-all duration-300 ${
                status === 'current' ? 'border-primary glow-primary' : status === 'locked' ? 'opacity-50' : ''
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {status === 'completed' ? <CheckCircle2 className="text-success" size={24} /> :
                     status === 'locked' ? <Lock className="text-muted-foreground" size={24} /> :
                     <ChevronRight className="text-primary animate-pulse" size={24} />}
                    <div>
                      <LevelBadge level={levelData.level} tier={status === 'current' ? currentTier : 3} size="lg" showTier={status === 'current'} />
                      <p className="font-body text-sm text-muted-foreground mt-1">{levelData.minQuestions}+ questions required</p>
                    </div>
                  </div>
                  {status === 'current' && (
                    <div className="flex gap-1">
                      {[3, 2, 1].map(t => (
                        <div key={t} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-display ${
                          t >= currentTier ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>{t}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="card-gaming p-6 bg-primary/10 border-primary/30">
          <h3 className="font-display font-bold mb-2">How Levels Work</h3>
          <ul className="font-body text-sm text-muted-foreground space-y-2">
            <li>• Each level has 3 tiers (3 → 2 → 1)</li>
            <li>• Complete 10 questions to advance a tier</li>
            <li>• Complete all 3 tiers to reach the next level</li>
            <li>• Reach Survivor to become a BOB Champion!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
