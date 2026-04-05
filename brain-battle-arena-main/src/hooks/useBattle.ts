import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import type { Tables } from '@/integrations/supabase/types';
import { getQuizQuestions } from '@/data/mockData';

interface BattleState {
  status: 'waiting' | 'countdown' | 'joinable' | 'active' | 'completed';
  battle: Tables<'battles'> | null;
  questions: Tables<'questions'>[];
  timeToStart: number; // seconds
  loading: boolean;
  error: string | null;
  hasJoined: boolean;
}

export function useBattle() {
  const { user, profile, isGuest } = useAuth();
  const [state, setState] = useState<BattleState>({
    status: 'waiting',
    battle: null,
    questions: [],
    timeToStart: 0,
    loading: false,
    error: null,
    hasJoined: false,
  });

  const calculateStatus = useCallback(() => {
    const now = new Date();
    const today5PM = new Date();
    today5PM.setHours(17, 0, 0, 0);
    const today455PM = new Date();
    today455PM.setHours(16, 55, 0, 0);

    const diffToStart = Math.floor((today5PM.getTime() - now.getTime()) / 1000);

    if (now >= today5PM) {
      return { status: 'active' as const, timeToStart: 0 };
    } else if (now >= today455PM) {
      return { status: 'joinable' as const, timeToStart: diffToStart };
    } else if (diffToStart <= 3600) {
      return { status: 'countdown' as const, timeToStart: diffToStart };
    }
    return { status: 'waiting' as const, timeToStart: diffToStart };
  }, []);

  useEffect(() => {
    const update = () => {
      const { status, timeToStart } = calculateStatus();
      setState(prev => ({ ...prev, status, timeToStart }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [calculateStatus]);

  // Check for today's battle
  useEffect(() => {
    if (isGuest) return;
    const checkBattle = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('battles')
        .select('*')
        .eq('battle_date', today)
        .single();
      
      if (data) {
        setState(prev => ({ ...prev, battle: data }));
        
        // Check if user already joined
        if (user) {
          const { data: participant } = await supabase
            .from('battle_participants')
            .select('*')
            .eq('battle_id', data.id)
            .eq('user_id', user.id)
            .single();
          
          if (participant) {
            setState(prev => ({ ...prev, hasJoined: true }));
          }
        }
      }
    };
    checkBattle();
  }, [user, isGuest]);

  const joinBattle = async () => {
    if (!user || !profile) return;
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      if (isGuest) {
        const mockQuestions = getQuizQuestions(profile.board as any, profile.class_level as any).map((item, index) => ({
          id: item.id,
          battle_id: 'guest-battle',
          board: item.board,
          class_level: item.class,
          correct_answer: item.correctAnswer,
          created_at: new Date().toISOString(),
          difficulty: item.difficulty,
          is_diamond: item.isDiamond,
          options: item.options,
          question_order: index + 1,
          question_pool: 'live',
          question_text: item.question,
          subject: item.subject,
        })) as Tables<'questions'>[];

        setState(prev => ({
          ...prev,
          battle: {
            id: 'guest-battle',
            battle_date: new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString(),
            scheduled_at: new Date().toISOString(),
            status: 'active',
          } as Tables<'battles'>,
          questions: mockQuestions,
          hasJoined: true,
          loading: false,
          status: 'active',
        }));
        return;
      }

      let battleId = state.battle?.id;

      // Create battle if it doesn't exist
      if (!battleId) {
        const today = new Date().toISOString().split('T')[0];
        const scheduledAt = new Date();
        scheduledAt.setHours(17, 0, 0, 0);
        
        const { data: newBattle, error } = await supabase
          .from('battles')
          .insert({ battle_date: today, scheduled_at: scheduledAt.toISOString(), status: 'active' })
          .select()
          .single();
        
        if (error) {
          // Battle might already exist (race condition)
          const { data: existing } = await supabase
            .from('battles')
            .select('*')
            .eq('battle_date', today)
            .single();
          battleId = existing?.id;
          if (existing) setState(prev => ({ ...prev, battle: existing }));
        } else {
          battleId = newBattle.id;
          setState(prev => ({ ...prev, battle: newBattle }));
        }
      }

      if (!battleId) throw new Error('Could not create/find battle');

      // Join as participant
      const { error: joinError } = await supabase
        .from('battle_participants')
        .insert({ battle_id: battleId, user_id: user.id });

      if (joinError && !joinError.message.includes('duplicate')) {
        throw joinError;
      }

      // Check if questions exist for this battle + board + class
      const { data: existingQ } = await supabase
        .from('questions')
        .select('*')
        .eq('battle_id', battleId)
        .eq('board', profile.board)
        .eq('class_level', profile.class_level)
        .eq('question_pool', 'live')
        .order('question_order');

      if (existingQ && existingQ.length >= 10) {
        setState(prev => ({ ...prev, questions: existingQ, hasJoined: true, loading: false }));
        return;
      }

      // Generate questions via edge function
      const { data: fnData, error: fnError } = await supabase.functions.invoke('generate-questions', {
        body: { board: profile.board, classLevel: profile.class_level, pool: 'live', battleId },
      });

      if (fnError) throw new Error(fnError.message);
      
      setState(prev => ({
        ...prev,
        questions: fnData.questions || [],
        hasJoined: true,
        loading: false,
      }));
    } catch (e: any) {
      console.error('Join battle error:', e);
      setState(prev => ({ ...prev, error: e.message, loading: false }));
    }
  };

  return { ...state, joinBattle };
}
