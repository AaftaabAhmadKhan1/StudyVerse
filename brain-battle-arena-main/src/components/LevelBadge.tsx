import { SeasonLevel } from '@/types/game';
import { Crown, Diamond, Star, Award, Flame, Sword, Shield, Medal } from 'lucide-react';

interface LevelBadgeProps {
  level: SeasonLevel;
  tier: 1 | 2 | 3;
  size?: 'sm' | 'md' | 'lg';
  showTier?: boolean;
}

const levelConfig: Record<SeasonLevel, { icon: typeof Crown; label: string; colorClass: string }> = {
  bronze: { icon: Medal, label: 'Bronze', colorClass: 'bg-bronze/20 text-bronze border-bronze/50' },
  silver: { icon: Shield, label: 'Silver', colorClass: 'bg-silver/20 text-silver border-silver/50' },
  gold: { icon: Award, label: 'Gold', colorClass: 'bg-gold/20 text-gold border-gold/50' },
  platinum: { icon: Star, label: 'Platinum', colorClass: 'bg-platinum/20 text-platinum border-platinum/50' },
  diamond: { icon: Diamond, label: 'Diamond', colorClass: 'bg-diamond/20 text-diamond border-diamond/50' },
  master: { icon: Crown, label: 'Master', colorClass: 'bg-master/20 text-master border-master/50' },
  conquer: { icon: Sword, label: 'Conquer', colorClass: 'bg-conquer/20 text-conquer border-conquer/50' },
  survivor: { icon: Flame, label: 'Survivor', colorClass: 'bg-survivor/20 text-survivor border-survivor/50' },
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs gap-1',
  md: 'px-3 py-1.5 text-sm gap-2',
  lg: 'px-4 py-2 text-base gap-2',
};

const iconSizes = {
  sm: 12,
  md: 16,
  lg: 20,
};

export function LevelBadge({ level, tier, size = 'md', showTier = true }: LevelBadgeProps) {
  const config = levelConfig[level];
  const Icon = config.icon;

  return (
    <div className={`level-badge flex items-center border ${config.colorClass} ${sizeClasses[size]}`}>
      <Icon size={iconSizes[size]} />
      <span>{config.label}</span>
      {showTier && <span className="opacity-70">{tier}</span>}
    </div>
  );
}
