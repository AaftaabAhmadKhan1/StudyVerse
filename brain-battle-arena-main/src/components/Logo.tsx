import { Brain } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export function Logo({ size = 'md', showTagline = true }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: 'text-xl', tagline: 'text-xs' },
    md: { icon: 32, text: 'text-2xl', tagline: 'text-sm' },
    lg: { icon: 48, text: 'text-4xl', tagline: 'text-base' },
    xl: { icon: 64, text: 'text-6xl', tagline: 'text-lg' },
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Brain 
            size={sizes[size].icon} 
            className="text-primary animate-pulse-glow"
          />
          <div className="absolute inset-0 blur-xl bg-primary/30 -z-10" />
        </div>
        <h1 className={`font-display font-black ${sizes[size].text} tracking-wider`}>
          <span className="text-gradient-primary">B</span>
          <span className="text-foreground">O</span>
          <span className="text-gradient-primary">B</span>
        </h1>
      </div>
      {showTagline && (
        <p className={`font-body ${sizes[size].tagline} text-muted-foreground uppercase tracking-[0.3em]`}>
          Battle of Brain
        </p>
      )}
    </div>
  );
}
