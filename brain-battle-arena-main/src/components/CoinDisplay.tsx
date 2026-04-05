import { Coins } from 'lucide-react';

interface CoinDisplayProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animate?: boolean;
}

export function CoinDisplay({ amount, size = 'md', showLabel = false, animate = false }: CoinDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm gap-1',
    md: 'text-lg gap-2',
    lg: 'text-2xl gap-3',
  };

  const iconSizes = {
    sm: 14,
    md: 20,
    lg: 28,
  };

  return (
    <div className={`flex items-center ${sizeClasses[size]} ${animate ? 'animate-bounce-subtle' : ''}`}>
      <div className="relative">
        <Coins size={iconSizes[size]} className="text-coin" />
        {animate && <div className="absolute inset-0 blur-md bg-coin/50 -z-10" />}
      </div>
      <span className="font-display font-bold text-coin">{amount}</span>
      {showLabel && <span className="font-body text-muted-foreground ml-1">Coins</span>}
    </div>
  );
}
