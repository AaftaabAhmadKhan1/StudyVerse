import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

const phoneToEmail = (phone: string) => `${phone.replace(/\D/g, '')}@bob.local`;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Tables<'profiles'> | null;
  userStats: Tables<'user_stats'> | null;
  isGuest: boolean;
  loading: boolean;
  signUp: (phone: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (phone: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Tables<'profiles'>>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_PROFILE_KEY = 'bob-guest-profile';
const GUEST_STATS_KEY = 'bob-guest-stats';

function defaultGuestProfile(userId: string): Tables<'profiles'> {
  const now = new Date().toISOString();
  return {
    id: `guest-profile-${userId}`,
    user_id: userId,
    username: 'Warrior',
    display_name: null,
    board: 'CBSE',
    class_level: '10th',
    total_coins: 0,
    avatar_url: null,
    created_at: now,
    updated_at: now,
  };
}

function defaultGuestStats(userId: string): Tables<'user_stats'> {
  const now = new Date().toISOString();
  return {
    id: `guest-stats-${userId}`,
    user_id: userId,
    total_questions: 0,
    correct_answers: 0,
    wrong_answers: 0,
    answered_in_5sec: 0,
    answered_in_10sec: 0,
    answered_in_30sec: 0,
    games_won: 0,
    top5_finishes: 0,
    top10_finishes: 0,
    current_level: 'bronze',
    current_tier: 3,
    total_coins: 0,
    questions_to_next_tier: 10,
    practice_questions: 0,
    practice_correct: 0,
    created_at: now,
    updated_at: now,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Tables<'profiles'> | null>(null);
  const [userStats, setUserStats] = useState<Tables<'user_stats'> | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadGuestState = () => {
    const guestUserId = 'guest-user';
    const guestUser = {
      id: guestUserId,
      email: 'guest@battle.local',
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: { username: 'Warrior' },
      identities: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as User;

    let nextProfile = defaultGuestProfile(guestUserId);
    let nextStats = defaultGuestStats(guestUserId);

    try {
      const storedProfile = localStorage.getItem(GUEST_PROFILE_KEY);
      const storedStats = localStorage.getItem(GUEST_STATS_KEY);
      if (storedProfile) nextProfile = { ...nextProfile, ...JSON.parse(storedProfile) };
      if (storedStats) nextStats = { ...nextStats, ...JSON.parse(storedStats) };
    } catch {
      // ignore malformed guest storage
    }

    setSession(null);
    setUser(guestUser);
    setProfile(nextProfile);
    setUserStats(nextStats);
    setIsGuest(true);
    setLoading(false);
  };

  const saveGuestProfile = (nextProfile: Tables<'profiles'>) => {
    localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(nextProfile));
    setProfile(nextProfile);
  };

  const saveGuestStats = (nextStats: Tables<'user_stats'>) => {
    localStorage.setItem(GUEST_STATS_KEY, JSON.stringify(nextStats));
    setUserStats(nextStats);
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
    setProfile(data);
  };

  const fetchStats = async (userId: string) => {
    const { data } = await supabase.from('user_stats').select('*').eq('user_id', userId).single();
    setUserStats(data);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsGuest(false);
        setTimeout(() => {
          fetchProfile(session.user.id);
          fetchStats(session.user.id);
        }, 0);
      } else {
        loadGuestState();
        return;
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsGuest(false);
        fetchProfile(session.user.id);
        fetchStats(session.user.id);
      } else {
        loadGuestState();
        return;
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (phone: string, password: string, name: string) => {
    const email = phoneToEmail(phone);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username: name, phone } },
    });
    return { error };
  };

  const signIn = async (phone: string, password: string) => {
    const email = phoneToEmail(phone);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    if (isGuest) {
      loadGuestState();
      return;
    }
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: Partial<Tables<'profiles'>>) => {
    if (!user) return;
    if (isGuest && profile) {
      const nextProfile = {
        ...profile,
        ...updates,
        updated_at: new Date().toISOString(),
      } as Tables<'profiles'>;
      saveGuestProfile(nextProfile);
      if (userStats && typeof updates.total_coins === 'number') {
        saveGuestStats({
          ...userStats,
          total_coins: updates.total_coins,
          updated_at: new Date().toISOString(),
        });
      }
      return;
    }
    await supabase.from('profiles').update(updates).eq('user_id', user.id);
    await fetchProfile(user.id);
  };

  const refreshProfile = async () => {
    if (isGuest) {
      loadGuestState();
      return;
    }
    if (user) await fetchProfile(user.id);
  };

  const refreshStats = async () => {
    if (isGuest) {
      loadGuestState();
      return;
    }
    if (user) await fetchStats(user.id);
  };

  return (
    <AuthContext.Provider value={{
      user, session, profile, userStats, isGuest, loading,
      signUp, signIn, signOut, updateProfile, refreshProfile, refreshStats,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
