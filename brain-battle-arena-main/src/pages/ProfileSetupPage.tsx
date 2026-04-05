import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { School, GraduationCap, ArrowRight, Loader2, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type Board = 'CBSE' | 'ICSE';
type ClassLevel = '9th' | '10th' | '11th' | '12th';

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { updateProfile, profile } = useAuth();
  const [username, setUsername] = useState(profile?.username || '');
  const [board, setBoard] = useState<Board | null>(profile?.board as Board || null);
  const [classLevel, setClassLevel] = useState<ClassLevel | null>(profile?.class_level as ClassLevel || null);
  const [saving, setSaving] = useState(false);

  const boards = [
    { value: 'CBSE' as Board, label: 'CBSE', icon: '📘' },
    { value: 'ICSE' as Board, label: 'ICSE', icon: '📗' },
  ];

  const classes = [
    { value: '9th' as ClassLevel, label: 'Class 9' },
    { value: '10th' as ClassLevel, label: 'Class 10' },
    { value: '11th' as ClassLevel, label: 'Class 11' },
    { value: '12th' as ClassLevel, label: 'Class 12' },
  ];

  const handleSave = async () => {
    if (!board || !classLevel || !username.trim()) return;
    setSaving(true);
    try {
      await updateProfile({ board, class_level: classLevel, username: username.trim(), display_name: username.trim() });
      toast({ title: '✅ Profile Updated!' });
      navigate('/');
    } catch {
      toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' });
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <Logo size="lg" />
          <p className="mt-4 font-body text-muted-foreground">Set up your profile to get started</p>
        </div>

        {/* Username */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 font-display text-sm uppercase tracking-wider text-muted-foreground">
            <User size={16} /> Your Name
          </label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your battle name"
            className="bg-card border-border font-body text-lg py-5"
            maxLength={30}
          />
        </div>

        {/* Board Selection */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 font-display text-sm uppercase tracking-wider text-muted-foreground">
            <School size={16} /> Select Board
          </label>
          <div className="grid grid-cols-2 gap-4">
            {boards.map((b) => (
              <button
                key={b.value}
                onClick={() => setBoard(b.value)}
                className={`card-gaming p-6 text-center transition-all duration-300 ${
                  board === b.value ? 'border-primary glow-primary' : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="text-4xl mb-2 block">{b.icon}</span>
                <span className="font-display font-bold text-lg">{b.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Class Selection */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 font-display text-sm uppercase tracking-wider text-muted-foreground">
            <GraduationCap size={16} /> Select Class
          </label>
          <div className="grid grid-cols-2 gap-3">
            {classes.map((c) => (
              <button
                key={c.value}
                onClick={() => setClassLevel(c.value)}
                className={`card-gaming p-4 text-center transition-all duration-300 ${
                  classLevel === c.value ? 'border-primary glow-primary' : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="font-display font-bold">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={!board || !classLevel || !username.trim() || saving}
          className="btn-gaming w-full py-6 text-lg rounded-xl disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" /> : (
            <>CONTINUE <ArrowRight className="ml-2" /></>
          )}
        </Button>
      </div>
    </div>
  );
}
