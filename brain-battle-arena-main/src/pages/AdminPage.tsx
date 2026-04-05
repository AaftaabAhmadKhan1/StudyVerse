import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Shield, Video, Save, Loader2, CheckCircle2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BOARDS = ['CBSE', 'ICSE'];
const CLASSES = ['9th', '10th', '11th', '12th'];

interface VideoEntry {
  id?: string;
  board: string;
  class_level: string;
  video_url: string;
  video_type: string;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    checkAdmin();
    loadVideos();
  }, [user]);

  const checkAdmin = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();
    setIsAdmin(!!data);
  };

  const loadVideos = async () => {
    const { data } = await supabase.from('battle_videos').select('*');
    const existing = data || [];

    // Create full grid of all board+class combos
    const grid: VideoEntry[] = [];
    for (const board of BOARDS) {
      for (const cls of CLASSES) {
        const found = existing.find((v: any) => v.board === board && v.class_level === cls);
        grid.push({
          id: found?.id,
          board,
          class_level: cls,
          video_url: found?.video_url || '',
          video_type: found?.video_type || 'youtube',
        });
      }
    }
    setVideos(grid);
  };

  const saveVideo = async (entry: VideoEntry) => {
    const key = `${entry.board}-${entry.class_level}`;
    setSaving(key);

    try {
      if (entry.id) {
        await supabase.from('battle_videos').update({
          video_url: entry.video_url,
          video_type: entry.video_type,
          updated_at: new Date().toISOString(),
        }).eq('id', entry.id);
      } else {
        const { data } = await supabase.from('battle_videos').insert({
          board: entry.board,
          class_level: entry.class_level,
          video_url: entry.video_url,
          video_type: entry.video_type,
        }).select().single();
        if (data) {
          setVideos(prev => prev.map(v =>
            v.board === entry.board && v.class_level === entry.class_level
              ? { ...v, id: data.id } : v
          ));
        }
      }
      toast({ title: 'Saved!', description: `Video for ${entry.board} Class ${entry.class_level} updated.` });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
    setSaving(null);
  };

  if (isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <Shield className="text-destructive mb-4" size={64} />
        <h1 className="font-display text-2xl font-bold mb-2">Access Denied</h1>
        <p className="font-body text-muted-foreground mb-6">You don't have admin privileges.</p>
        <Button onClick={() => navigate('/')} variant="outline">Go Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft size={20} /> Back
          </Button>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <Shield className="text-primary" /> Admin Panel
          </h1>
          <div />
        </div>

        <div className="card-gaming p-6">
          <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
            <Video className="text-primary" /> Pre-Battle Videos
          </h2>
          <p className="font-body text-sm text-muted-foreground mb-6">
            Paste YouTube or Google Drive video links for each board & class combination. These play for 1 minute before the live battle starts.
          </p>

          <div className="space-y-6">
            {BOARDS.map(board => (
              <div key={board}>
                <h3 className="font-display text-lg font-bold mb-3 text-primary">{board}</h3>
                <div className="grid gap-4">
                  {videos.filter(v => v.board === board).map(entry => {
                    const key = `${entry.board}-${entry.class_level}`;
                    return (
                      <div key={key} className="flex items-end gap-3 p-4 bg-muted/30 rounded-xl">
                        <div className="flex-shrink-0 w-24">
                          <Label className="font-display text-sm">Class {entry.class_level}</Label>
                        </div>
                        <div className="flex-1">
                          <Input
                            placeholder="https://youtube.com/watch?v=... or Google Drive link"
                            value={entry.video_url}
                            onChange={e => setVideos(prev => prev.map(v =>
                              v.board === entry.board && v.class_level === entry.class_level
                                ? { ...v, video_url: e.target.value } : v
                            ))}
                          />
                        </div>
                        <Button
                          size="sm"
                          onClick={() => saveVideo(entry)}
                          disabled={!entry.video_url || saving === key}
                          className="flex-shrink-0"
                        >
                          {saving === key ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        </Button>
                        {entry.id && entry.video_url && (
                          <a href={entry.video_url} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="ghost"><ExternalLink size={16} /></Button>
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
