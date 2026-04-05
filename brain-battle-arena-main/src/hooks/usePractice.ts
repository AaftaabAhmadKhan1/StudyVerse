import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import type { Tables } from '@/integrations/supabase/types';
import { getQuizQuestions } from '@/data/mockData';

export function usePractice() {
  const { user, profile, isGuest } = useAuth();
  const [questions, setQuestions] = useState<Tables<'questions'>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startPractice = async () => {
    if (!user || !profile) return;
    setLoading(true);
    setError(null);

    try {
      if (isGuest) {
        const localQuestions = getQuizQuestions(profile.board as any, profile.class_level as any).map((item, index) => ({
          id: item.id,
          battle_id: null,
          board: item.board,
          class_level: item.class,
          correct_answer: item.correctAnswer,
          created_at: new Date().toISOString(),
          difficulty: item.difficulty,
          is_diamond: item.isDiamond,
          options: item.options,
          question_order: index + 1,
          question_pool: 'practice',
          question_text: item.question,
          subject: item.subject,
        })) as Tables<'questions'>[];
        setQuestions(localQuestions);
        setLoading(false);
        return;
      }

      const { data: fnData, error: fnError } = await supabase.functions.invoke('generate-questions', {
        body: { board: profile.board, classLevel: profile.class_level, pool: 'practice' },
      });

      if (fnError) throw new Error(fnError.message);
      setQuestions(fnData.questions || []);
    } catch (e: any) {
      console.error('Practice error:', e);
      setError(e.message);
    }
    setLoading(false);
  };

  return { questions, loading, error, startPractice };
}
