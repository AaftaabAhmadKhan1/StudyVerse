'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Orbitron, Rajdhani } from 'next/font/google';
import {
  ArrowLeft,
  Brain,
  Check,
  Coins,
  Crown,
  Gauge,
  Home,
  Swords,
  Target,
  Timer,
  Trophy,
  UserCircle2,
  X,
  Zap,
} from 'lucide-react';

import {
  BATTLE_SHOP_ITEMS,
  BATTLE_LEVELS,
  BOARD_OPTIONS,
  CLASS_OPTIONS,
  buildBattleQuestionSet,
  getBattleBadges,
  calculateBattleCountdown,
  getBattleComputedStats,
  getBattleLevelState,
  getBattleProfile,
  getBattleUserId,
  purchaseBattleItem,
  recordBattleAnswerBatch,
  syncBattleIdentity,
  type BattleAnswerRecord,
  type BattleBoard,
  type BattleClassLevel,
  type BattleMode,
  type BattleQuestion,
} from '@/lib/battleOfBrains';
import { useAuth } from '@/contexts/AuthContext';
import { useYTWallah } from '@/contexts/YTWallahContext';
import { cn } from '@/lib/utils';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-bob-display',
  weight: ['500', '700', '800', '900'],
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  variable: '--font-bob-body',
  weight: ['400', '500', '600', '700'],
});

const BATTLE_ENTRY_KEY = 'pw-studyverse-bob-entry';
const dashboardNav = ['Dashboard', 'Levels', 'Coin Shop', 'Stats'] as const;
type DashboardTab = (typeof dashboardNav)[number];

type ResultState = 'correct' | 'wrong' | 'timeout';

type BattleSession = {
  battleId: string;
  mode: BattleMode;
  questions: BattleQuestion[];
  currentIndex: number;
  timeLeft: number;
  records: BattleAnswerRecord[];
  questionStartedAt: number;
  selectedSubject: string;
};

export default function BattleOfBrainsDashboardPage() {
  const { user } = useAuth();
  const { siteSettings } = useYTWallah();
  const [selectedBoard, setSelectedBoard] = useState<BattleBoard>('CBSE');
  const [selectedClass, setSelectedClass] = useState<BattleClassLevel>('10th');
  const [activeTab, setActiveTab] = useState<DashboardTab>('Dashboard');
  const [selectedSubject] = useState('Mixed');
  const [countdown, setCountdown] = useState(() => calculateBattleCountdown());
  const [session, setSession] = useState<BattleSession | null>(null);
  const [resultOverlay, setResultOverlay] = useState<{
    state: ResultState;
    correctAnswer: number;
  } | null>(null);
  const [battleProfileCoins, setBattleProfileCoins] = useState(() => getBattleProfile().coins);
  const [battleProfile, setBattleProfile] = useState(() => getBattleProfile());
  const [showPromoOverlay, setShowPromoOverlay] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(BATTLE_ENTRY_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as {
        board?: BattleBoard;
        classLevel?: BattleClassLevel;
      };
      if (parsed.board) setSelectedBoard(parsed.board);
      if (parsed.classLevel) setSelectedClass(parsed.classLevel);
    } catch {
      // ignore malformed saved selection
    }
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCountdown(calculateBattleCountdown());
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const refreshProfile = () => {
      const profile = getBattleProfile();
      setBattleProfile(profile);
      setBattleProfileCoins(profile.coins);
    };
    window.addEventListener('storage', refreshProfile);
    return () => window.removeEventListener('storage', refreshProfile);
  }, []);

  useEffect(() => {
    syncBattleIdentity(user?.email);
    const profile = getBattleProfile();
    setBattleProfile(profile);
    setBattleProfileCoins(profile.coins);
  }, [user?.email]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(
      BATTLE_ENTRY_KEY,
      JSON.stringify({ board: selectedBoard, classLevel: selectedClass })
    );
  }, [selectedBoard, selectedClass]);

  useEffect(() => {
    if (!session || resultOverlay) return;

    const interval = window.setInterval(() => {
      setSession((current) => {
        if (!current) return current;
        const nextTimeLeft = Math.max(
          0,
          60 - Math.floor((Date.now() - current.questionStartedAt) / 1000)
        );
        return { ...current, timeLeft: nextTimeLeft };
      });
    }, 250);

    return () => window.clearInterval(interval);
  }, [session, resultOverlay]);

  const currentQuestion = session ? session.questions[session.currentIndex] : null;

  const timerPercent = useMemo(() => {
    if (!session) return 100;
    return Math.max(0, Math.min(100, (session.timeLeft / 60) * 100));
  }, [session]);

  const timerBarClassName = timerPercent > 50
    ? 'bg-emerald-400'
    : timerPercent > 20
      ? 'bg-[#ffd400]'
      : 'bg-pink-500';

  const promoVideo = (siteSettings.battlePromoVideos || []).find(
    (item) =>
      item.isActive &&
      item.board === selectedBoard &&
      item.classLevel === selectedClass &&
      extractYoutubeVideoId(item.videoUrl)
  );
  const promoVideoId = promoVideo ? extractYoutubeVideoId(promoVideo.videoUrl) : null;
  const profileName =
    user?.name?.trim() || user?.email?.split('@')[0] || battleProfile.userId || 'StudyVerse Player';
  const profileEmail = user?.email?.trim() || 'Connected with local battle profile';
  const profileImage = user?.image?.trim() || null;

  const launchBattle = (mode: BattleMode) => {
    const questions = buildBattleQuestionSet(selectedBoard, selectedClass);
    setSession({
      battleId: `battle-${Date.now()}`,
      mode,
      questions,
      currentIndex: 0,
      timeLeft: 60,
      records: [],
      questionStartedAt: Date.now(),
      selectedSubject,
    });
    setResultOverlay(null);
  };

  const startBattle = (mode: BattleMode) => {
    if (mode === 'live' && promoVideoId) {
      setShowPromoOverlay(true);
      return;
    }
    launchBattle(mode);
  };

  const moveToNextQuestion = useCallback((records: BattleAnswerRecord[]) => {
    setSession((current) => {
      if (!current) return current;
      const nextIndex = current.currentIndex + 1;
      if (nextIndex >= current.questions.length) {
        return {
          ...current,
          records,
          currentIndex: current.questions.length,
          timeLeft: 0,
        };
      }
      return {
        ...current,
        records,
        currentIndex: nextIndex,
        timeLeft: 60,
        questionStartedAt: Date.now(),
      };
    });
    setResultOverlay(null);
    const profile = getBattleProfile();
    setBattleProfileCoins(profile.coins);
    setBattleProfile(profile);
  }, []);

  const submitAnswer = useCallback((selectedAnswer: number | null, timedOut = false) => {
    setSession((current) => {
      if (!current) return current;
      const question = current.questions[current.currentIndex];
      if (!question) return current;

      const timeSpent = Math.min(
        60,
        Math.max(0, Math.floor((Date.now() - current.questionStartedAt) / 1000))
      );
      const isCorrect = selectedAnswer === question.correctAnswer;
      const record: BattleAnswerRecord = {
        userId: getBattleUserId(),
        questionId: question.id,
        battleId: current.battleId,
        selectedAnswer,
        isCorrect: !timedOut && isCorrect,
        timeSpent,
        coinsEarned: !timedOut && isCorrect && question.isDiamond ? 5 : 0,
        answeredAt: new Date().toISOString(),
        mode: current.mode,
        subject: question.subject,
        difficulty: question.difficulty,
      };

      recordBattleAnswerBatch([record]);
      const records = [...current.records, record];
      setResultOverlay({
        state: timedOut ? 'timeout' : isCorrect ? 'correct' : 'wrong',
        correctAnswer: question.correctAnswer,
      });
      window.setTimeout(() => moveToNextQuestion(records), 2000);
      return { ...current, records };
    });
  }, [moveToNextQuestion]);

  useEffect(() => {
    if (!session || resultOverlay || session.timeLeft > 0) return;
    submitAnswer(null, true);
  }, [session, resultOverlay, submitAnswer]);

  const restartSession = () => {
    setSession(null);
    setResultOverlay(null);
    const profile = getBattleProfile();
    setBattleProfileCoins(profile.coins);
    setBattleProfile(profile);
  };

  const handlePurchase = (itemId: string) => {
    const result = purchaseBattleItem(itemId);
    setBattleProfile(result.profile);
    setBattleProfileCoins(result.profile.coins);
  };

  const computedStats = getBattleComputedStats(battleProfile);
  const levelState = getBattleLevelState(battleProfile.totalQuestionsAnswered);
  const accuracyLabel = `${Math.round(computedStats.accuracy)}%`;
  const avgSpeedLabel = `${computedStats.avgSpeed.toFixed(1)}s`;
  const badgeCards = getBattleBadges(battleProfile, computedStats).slice(0, 3).map((badge) => ({
    ...badge,
    icon:
      badge.id === 'brainiac-king'
        ? Crown
        : badge.id === 'speedster'
          ? Zap
          : Trophy,
  }));
  const statsSplitRows = [
    ...(computedStats.subjectAccuracy.length
      ? computedStats.subjectAccuracy.slice(0, 3).map((item) => [item.label, `${Math.round(item.accuracy)}%`] as const)
      : ([['No Subject Data', '0%']] as const)),
    ['Avg Speed', avgSpeedLabel] as const,
  ];
  const shopCards = BATTLE_SHOP_ITEMS.map((item) => ({
    ...item,
    accent:
      item.id === 'bob-cap'
        ? 'cyan'
        : item.id === 'bob-tshirt'
          ? 'violet'
          : item.id === 'study-guide-book'
            ? 'amber'
            : 'gradient',
    status: battleProfile.ownedShopItemIds.includes(item.id)
      ? 'Owned'
      : battleProfile.coins >= item.cost
        ? 'Available'
        : 'Locked',
  }));

  return (
    <main
      className={cn(
        orbitron.variable,
        rajdhani.variable,
        'min-h-screen bg-[#06080d] px-2 py-2 text-white sm:px-3 lg:px-4'
      )}
    >
      {showPromoOverlay ? (
        <BattlePromoOverlay
          title={promoVideo?.title || `${selectedBoard} Class ${selectedClass} Live Battle Promo`}
          videoId={promoVideoId}
          onClose={() => setShowPromoOverlay(false)}
          onContinue={() => {
            setShowPromoOverlay(false);
            launchBattle('live');
          }}
        />
      ) : null}
      <div className="mx-auto max-w-[1440px] overflow-hidden rounded-[26px] border border-cyan-400/12 bg-[linear-gradient(180deg,#0f121b,#0b1018)] shadow-[0_24px_90px_rgba(0,0,0,0.56)]">
        <header className="sticky top-0 z-40 flex flex-col gap-3 border-b border-white/6 bg-[#12151d]/80 px-4 py-3 backdrop-blur-xl sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <div className="flex items-center gap-4">
            <Link href="/battle-of-brains" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#1fe7ff,#9238ff,#ffcb1f)] shadow-[0_0_18px_rgba(30,231,255,0.38)]">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="[font-family:var(--font-bob-display)] text-[1.65rem] font-black tracking-[-0.08em] text-white">
                  BOB
                </p>
                <p className="[font-family:var(--font-bob-body)] text-[0.72rem] uppercase tracking-[0.22em] text-cyan-300">
                  Battle Of Brain
                </p>
              </div>
            </Link>

            <nav className="flex flex-wrap items-center gap-2 sm:gap-3">
              {dashboardNav.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveTab(item)}
                  className={cn(
                    'rounded-full px-3 py-1.5 [font-family:var(--font-bob-body)] text-[0.88rem] font-semibold transition sm:text-[0.95rem]',
                    activeTab === item
                      ? 'bg-cyan-400/12 text-cyan-300'
                      : 'text-white/35 hover:bg-white/5 hover:text-white/70'
                  )}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/battle-of-brains"
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/8 px-3 py-2 [font-family:var(--font-bob-body)] text-[0.88rem] font-semibold text-cyan-200"
            >
              <Home className="h-4 w-4" />
              Go to Home Page
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 [font-family:var(--font-bob-body)] text-[0.88rem] font-semibold text-white/80"
            >
              <ArrowLeft className="h-4 w-4" />
              Return To Study Verse
            </Link>
            <div className="hidden items-center gap-2 rounded-full border border-[#ffd400]/18 bg-[#ffd400]/10 px-4 py-2 lg:flex">
              <Coins className="h-4 w-4 text-[#ffd400]" />
              <span className="[font-family:var(--font-bob-display)] text-[1.05rem] font-bold text-[#ffd400]">
                {battleProfileCoins}
              </span>
            </div>
            <div className="hidden rounded-full border border-violet-400/18 bg-violet-500/10 px-4 py-2 [font-family:var(--font-bob-display)] text-[0.88rem] font-bold text-violet-200 lg:block">
              {levelState.currentLevel.name} T{levelState.currentTier}
            </div>
            <div className="hidden lg:flex">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={profileName}
                  className="h-10 w-10 rounded-full border border-cyan-300/25 object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/25 bg-[radial-gradient(circle_at_top,#37e7ff,#14233a)]">
                  <UserCircle2 className="h-6 w-6 text-white" />
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="bg-[radial-gradient(circle_at_top_left,rgba(33,214,255,0.08),transparent_24%),radial-gradient(circle_at_top_right,rgba(145,54,255,0.1),transparent_24%),linear-gradient(180deg,#101521,#111622_50%,#131a28)] px-4 py-4 sm:px-5 lg:px-6">
          {activeTab === 'Dashboard' ? (
            session && currentQuestion ? (
              <QuizSessionPanel
                currentQuestion={currentQuestion}
                currentIndex={session.currentIndex}
                totalQuestions={session.questions.length}
                mode={session.mode}
                timeLeft={session.timeLeft}
                timerPercent={timerPercent}
                timerBarClassName={timerBarClassName}
                selectedBoard={selectedBoard}
                selectedClass={selectedClass}
                selectedSubject={session.selectedSubject}
                resultOverlay={resultOverlay}
                onAnswer={submitAnswer}
              />
            ) : session ? (
              <QuizSummaryPanel
                mode={session.mode}
                records={session.records}
                coinBalance={battleProfileCoins}
                onRestart={restartSession}
              />
            ) : (
              <div className="space-y-4">
                <section className="grid gap-4 xl:grid-cols-[1.25fr_0.72fr]">
                  <div className="rounded-[22px] border border-cyan-400/12 bg-[linear-gradient(180deg,#182238,#151b2a)] p-5">
                    <p className="[font-family:var(--font-bob-display)] text-[2.15rem] font-bold leading-none text-white sm:text-[2.6rem]">
                      Welcome back,
                    </p>
                    <h1 className="mt-1 [font-family:var(--font-bob-display)] text-[2.45rem] font-black leading-none tracking-[-0.08em] text-transparent bg-[linear-gradient(90deg,#26ebff,#8f49ff)] bg-clip-text sm:text-[3rem]">
                      {profileName}
                    </h1>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-cyan-400/18 bg-cyan-400/10 px-3 py-1 [font-family:var(--font-bob-body)] text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-cyan-300">
                        {selectedBoard} Board
                      </span>
                      <span className="rounded-full border border-violet-400/18 bg-violet-500/10 px-3 py-1 [font-family:var(--font-bob-body)] text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-violet-200">
                        Class {selectedClass}
                      </span>
                    </div>
                    <p className="[font-family:var(--font-bob-body)] mt-2 text-[0.88rem] text-white/40">
                      {profileEmail}
                    </p>

                    <div className="mt-4 inline-flex rounded-[18px] border border-white/8 bg-[#0e1219] p-4">
                      <div>
                        <p className="[font-family:var(--font-bob-body)] text-[0.72rem] uppercase tracking-[0.2em] text-white/38">
                          Next Live Battle
                        </p>
                        <div className="mt-2 flex items-end gap-3">
                          <CountdownUnit value={countdown.hours} label="Hours" />
                          <div className="[font-family:var(--font-bob-display)] text-[1.6rem] text-cyan-300">:</div>
                          <CountdownUnit value={countdown.minutes} label="Mins" />
                          <div className="[font-family:var(--font-bob-display)] text-[1.6rem] text-cyan-300">:</div>
                          <CountdownUnit value={countdown.seconds} label="Secs" accent="pink" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-violet-400/18 bg-[linear-gradient(180deg,#11131d,#0d1118)] p-4">
                    <div className="rounded-[18px] border border-cyan-400/15 bg-[radial-gradient(circle_at_top,rgba(26,230,255,0.12),transparent_38%),linear-gradient(180deg,#091119,#0c1017)] p-3">
                      <div className="h-[170px] rounded-[16px] bg-[radial-gradient(circle_at_center,rgba(52,240,255,0.18),transparent_32%),radial-gradient(circle_at_center,rgba(162,53,255,0.18),transparent_46%),linear-gradient(180deg,#0d1020,#090d15)]">
                        <div className="flex h-full items-center justify-center">
                          <div className="h-24 w-24 rounded-full border border-cyan-300/25 bg-[radial-gradient(circle_at_35%_30%,rgba(32,233,255,0.9),rgba(149,54,255,0.45)_54%,transparent_72%)] shadow-[0_0_30px_rgba(32,233,255,0.18)]" />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="[font-family:var(--font-bob-display)] text-[1.2rem] font-bold text-white">
                            Daily Challenge
                          </p>
                          <p className="[font-family:var(--font-bob-body)] text-[0.82rem] text-white/38">
                            Finish the full 10-question run without skipping.
                          </p>
                        </div>
                        <button className="rounded-[12px] border border-cyan-400/25 bg-cyan-400/10 px-3 py-2 [font-family:var(--font-bob-body)] text-[0.82rem] font-bold text-cyan-200">
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="grid gap-4 xl:grid-cols-2">
                  <div className="rounded-[22px] border border-pink-500/22 bg-[linear-gradient(180deg,#18111a,#121018)] p-5">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(255,64,126,0.75)]" />
                          <h2 className="[font-family:var(--font-bob-display)] text-[1.7rem] font-bold text-white">
                            Live Battle
                          </h2>
                        </div>
                        <p className="[font-family:var(--font-bob-body)] text-[0.92rem] text-white/35">
                          10 questions, one shot, global pace.
                        </p>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-pink-400/25 bg-pink-500/10">
                        <Swords className="h-4 w-4 text-pink-300" />
                      </div>
                    </div>
                    <div className="rounded-[16px] border border-white/6 bg-black/35 p-4">
                      <div className="flex items-center justify-between [font-family:var(--font-bob-body)] text-[0.72rem] uppercase tracking-[0.16em] text-white/35">
                        <span>3 Easy • 4 Medium • 3 Hard</span>
                        <span className="text-[#ffd400]">3 Diamond</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="[font-family:var(--font-bob-body)] text-[0.92rem] text-pink-300">
                          Auto-submit on timeout. No going back.
                        </p>
                        <p className="[font-family:var(--font-bob-body)] text-[0.9rem] text-white/35">{countdown.label}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => startBattle('live')}
                      className="mt-4 w-full rounded-[16px] border border-pink-500/45 bg-[#110f18] px-5 py-3 [font-family:var(--font-bob-display)] text-[1rem] font-bold text-pink-300"
                    >
                      Join Live Battle
                    </button>
                  </div>

                  <div className="rounded-[22px] border border-emerald-500/22 bg-[linear-gradient(180deg,#111918,#0d1513)] p-5">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(0,255,140,0.65)]" />
                          <h2 className="[font-family:var(--font-bob-display)] text-[1.7rem] font-bold text-white">
                            Practice Mode
                          </h2>
                        </div>
                        <p className="[font-family:var(--font-bob-body)] text-[0.92rem] text-white/35">
                          Same mechanics, perfect for focused reps.
                        </p>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-500/10">
                        <Target className="h-4 w-4 text-emerald-300" />
                      </div>
                    </div>
                    <div className="space-y-3 rounded-[16px] border border-white/6 bg-black/35 p-4">
                      <DashboardSelect
                        label="Board:"
                        value={selectedBoard}
                        options={[...BOARD_OPTIONS]}
                        onChange={(value) => setSelectedBoard(value as BattleBoard)}
                      />
                      <DashboardSelect
                        label="Class:"
                        value={selectedClass}
                        options={[...CLASS_OPTIONS]}
                        onChange={(value) => setSelectedClass(value as BattleClassLevel)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => startBattle('practice')}
                      className="mt-4 w-full rounded-[16px] border border-emerald-400/45 bg-emerald-500/14 px-5 py-3 [font-family:var(--font-bob-display)] text-[1rem] font-bold text-emerald-200"
                    >
                      Start Practice
                    </button>
                  </div>
                </section>
              </div>
            )
          ) : null}

          {activeTab === 'Levels' ? (
            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[22px] border border-violet-400/18 bg-[linear-gradient(180deg,#151822,#11151d)] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-violet-300" />
                  <h3 className="[font-family:var(--font-bob-display)] text-[1.5rem] font-bold text-white">
                    Levels Overview
                  </h3>
                </div>
                <div className="grid gap-3 md:grid-cols-4">
                  {BATTLE_LEVELS.map((level, index) => {
                    const isCompleted = index < levelState.currentLevelIndex;
                    const isCurrent = index === levelState.currentLevelIndex;
                    const progress = isCompleted
                      ? '100%'
                      : isCurrent
                        ? `${Math.round(levelState.progressToNextLevel)}%`
                        : '0%';
                    return (
                    <div
                      key={level.name}
                      className={cn(
                        'rounded-[16px] border p-4',
                        isCurrent
                          ? 'border-cyan-400/35 bg-cyan-400/8'
                          : 'border-white/8 bg-black/25'
                      )}
                    >
                      <p className="[font-family:var(--font-bob-display)] text-[1.15rem] font-bold text-white">{level.name}</p>
                      <p className="[font-family:var(--font-bob-body)] text-[0.8rem] text-white/35">
                        {isCompleted ? 'Completed' : isCurrent ? `Tier ${levelState.currentTier}` : 'Locked'}
                      </p>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            isCompleted && 'w-full bg-[#ffd400]',
                            isCurrent && 'bg-[linear-gradient(90deg,#20e7ff,#a33cff)]',
                            !isCompleted && !isCurrent && 'w-0'
                          )}
                          style={isCurrent ? { width: `${levelState.progressToNextLevel}%` } : undefined}
                        />
                      </div>
                      <p className="[font-family:var(--font-bob-body)] mt-2 text-[0.75rem] uppercase tracking-[0.14em] text-white/35">
                        {progress}
                      </p>
                    </div>
                  );
                  })}
                </div>
              </div>

              <div className="rounded-[22px] border border-amber-400/14 bg-[linear-gradient(180deg,#16171f,#11151d)] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-[#ffd400]" />
                  <h3 className="[font-family:var(--font-bob-display)] text-[1.5rem] font-bold text-white">
                    Earned Badges
                  </h3>
                </div>
                <div className="space-y-3">
                  {badgeCards.map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <div
                        key={badge.title}
                        className={cn(
                          'flex items-center gap-3 rounded-[16px] border bg-black/30 px-4 py-3',
                          badge.accent === 'amber' && 'border-amber-400/22',
                          badge.accent === 'cyan' && 'border-cyan-400/22',
                          badge.accent === 'muted' && 'border-white/8 opacity-60'
                        )}
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-white/10 bg-white/[0.04]">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="[font-family:var(--font-bob-display)] text-[1rem] font-bold text-white">{badge.title}</p>
                          <p className="[font-family:var(--font-bob-body)] text-[0.85rem] text-white/35">{badge.detail}</p>
                          <p className="[font-family:var(--font-bob-body)] mt-1 text-[0.78rem] font-semibold text-cyan-200/80">
                            {badge.progressLabel}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === 'Coin Shop' ? (
            <div className="space-y-4">
              <section className="rounded-[22px] border border-[#ffd400]/14 bg-[linear-gradient(180deg,#15161d,#11151d)] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-[#ffd400]" />
                    <h3 className="[font-family:var(--font-bob-display)] text-[1.5rem] font-bold text-white">
                      Coin Shop
                    </h3>
                  </div>
                  <span className="rounded-full border border-[#ffd400]/18 bg-[#ffd400]/10 px-3 py-1 [font-family:var(--font-bob-body)] text-[0.82rem] font-bold text-[#ffd400]">
                    Balance: {battleProfileCoins}
                  </span>
                </div>
                <div className="grid gap-4 xl:grid-cols-4">
                  {shopCards.map((card) => (
                    <div
                      key={card.id}
                      className={cn(
                        'rounded-[18px] border bg-black/30 p-4',
                        card.accent === 'cyan' && 'border-cyan-400/22',
                        card.accent === 'violet' && 'border-violet-400/22',
                        card.accent === 'amber' && 'border-amber-400/22',
                        card.accent === 'gradient' && 'border-white/10'
                      )}
                    >
                      <p className="[font-family:var(--font-bob-display)] text-[1.2rem] font-bold text-white">{card.title}</p>
                      <p className="[font-family:var(--font-bob-body)] mt-2 text-[0.88rem] text-white/38">{card.description}</p>
                      <p className="[font-family:var(--font-bob-body)] mt-3 text-[0.76rem] uppercase tracking-[0.16em] text-white/35">
                        {card.status}
                      </p>
                      <div className="mt-5 flex items-center gap-2">
                        <Coins className="h-4 w-4 text-[#ffd400]" />
                        <span className="[font-family:var(--font-bob-display)] text-[1.4rem] font-bold text-[#ffd400]">{card.cost}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePurchase(card.id)}
                        disabled={card.status !== 'Available'}
                        className={cn(
                          'mt-4 w-full rounded-[14px] px-4 py-3 [font-family:var(--font-bob-display)] text-[0.95rem] font-bold',
                          card.accent === 'gradient'
                            ? 'bg-[linear-gradient(90deg,#1fe7ff,#7d47ff)] text-white'
                            : 'border border-white/10 bg-white/[0.04] text-white/90',
                          card.status !== 'Available' && 'cursor-not-allowed opacity-55'
                        )}
                      >
                        {card.status === 'Owned' ? 'Owned' : card.status === 'Locked' ? 'Locked' : 'Purchase'}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : null}

          {activeTab === 'Stats' ? (
            <div className="space-y-4">
              <section className="grid gap-4 md:grid-cols-4">
                {[
                  { label: 'Weekly XP', value: `+${computedStats.weeklyXp}`, accent: 'cyan' },
                  { label: 'Battles Won', value: String(computedStats.battlesWon), accent: 'green' },
                  { label: 'Current Rank', value: `#${computedStats.currentRank}`, accent: 'amber' },
                  { label: 'Best Streak', value: `${computedStats.bestStreak}`, accent: 'violet' },
                ].map((card) => (
                  <div
                    key={card.label}
                    className={cn(
                      'rounded-[18px] border p-4',
                      card.accent === 'cyan' && 'border-cyan-400/22 bg-cyan-400/6',
                      card.accent === 'green' && 'border-emerald-400/22 bg-emerald-400/6',
                      card.accent === 'amber' && 'border-amber-400/22 bg-amber-400/6',
                      card.accent === 'violet' && 'border-violet-400/22 bg-violet-500/6'
                    )}
                  >
                    <p className="[font-family:var(--font-bob-body)] text-[0.78rem] uppercase tracking-[0.16em] text-white/35">{card.label}</p>
                    <p className="[font-family:var(--font-bob-display)] mt-2 text-[1.8rem] font-bold text-white">{card.value}</p>
                  </div>
                ))}
              </section>

              <section className="rounded-[22px] border border-cyan-400/16 bg-[linear-gradient(180deg,#141923,#10141c)] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-cyan-300" />
                    <h3 className="[font-family:var(--font-bob-display)] text-[1.5rem] font-bold text-white">
                      Stats Preview
                    </h3>
                  </div>
                  <span className="rounded-full border border-cyan-400/22 bg-cyan-400/10 px-3 py-1 [font-family:var(--font-bob-body)] text-[0.72rem] font-bold text-cyan-200">
                    Live Snapshot
                  </span>
                </div>
                <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[18px] border border-white/8 bg-black/25 p-4">
                    <div className="mb-3 flex items-center justify-between [font-family:var(--font-bob-body)] text-[0.72rem] uppercase tracking-[0.16em] text-white/35">
                      <span>Question accuracy split</span>
                      <span>{accuracyLabel}</span>
                    </div>
                    <div className="space-y-3">
                      {statsSplitRows.map(([label, value], index) => (
                        <div key={label}>
                          <div className="mb-1 flex items-center justify-between [font-family:var(--font-bob-body)] text-[0.88rem] text-white/55">
                            <span>{label}</span>
                            <span>{value}</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-white/8">
                            <div
                              className={cn(
                                'h-full rounded-full',
                                index === 0 && 'bg-cyan-300',
                                index === 1 && 'bg-emerald-400',
                                index === 2 && 'bg-[#ffd400]',
                                index === 3 && 'bg-violet-400'
                              )}
                              style={{ width: `${index === 3 ? Math.min(100, (computedStats.avgSpeed / 60) * 100) : Number.parseInt(String(value), 10) || 0}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[18px] border border-white/8 bg-black/25 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-violet-300" />
                      <h4 className="[font-family:var(--font-bob-display)] text-[1.15rem] font-bold text-white">
                        Performance Signals
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: 'Accuracy', value: accuracyLabel, icon: Gauge },
                        { label: 'Correct', value: String(battleProfile.correctAnswers), icon: Check },
                        { label: 'Wrong', value: String(battleProfile.wrongAnswers), icon: X },
                        { label: 'Avg Speed', value: avgSpeedLabel, icon: Zap },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.label} className="flex items-center justify-between rounded-[14px] border border-white/8 bg-white/[0.03] px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Icon className="h-4 w-4 text-cyan-300" />
                              <span className="[font-family:var(--font-bob-body)] text-[0.88rem] text-white/55">{item.label}</span>
                            </div>
                            <span className="[font-family:var(--font-bob-display)] text-[1.1rem] font-bold text-white">{item.value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}

function CountdownUnit({
  value,
  label,
  accent = 'white',
}: {
  value: number;
  label: string;
  accent?: 'white' | 'pink';
}) {
  return (
    <div className="text-center">
      <p
        className={cn(
          '[font-family:var(--font-bob-display)] text-[2rem] font-bold leading-none',
          accent === 'pink' ? 'text-[#ff4f7b]' : 'text-white'
        )}
      >
        {String(value).padStart(2, '0')}
      </p>
      <span className="[font-family:var(--font-bob-body)] text-[0.68rem] uppercase tracking-[0.16em] text-white/35">
        {label}
      </span>
    </div>
  );
}

function BattlePromoOverlay({
  title,
  videoId,
  onClose,
  onContinue,
}: {
  title: string;
  videoId: string | null;
  onClose: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#05070d]/88 px-4 backdrop-blur-md">
      <div className="w-full max-w-[920px] rounded-[28px] border border-cyan-400/18 bg-[linear-gradient(180deg,#131723,#10131d)] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="[font-family:var(--font-bob-body)] text-sm uppercase tracking-[0.25em] text-cyan-300/80">
              Live Battle Promo
            </p>
            <h2 className="[font-family:var(--font-bob-display)] text-[1.8rem] font-bold text-white">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {videoId ? (
          <div className="overflow-hidden rounded-[22px] border border-white/8 bg-black">
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <div className="flex min-h-[260px] items-center justify-center rounded-[22px] border border-dashed border-white/12 bg-black/30 text-center">
            <p className="[font-family:var(--font-bob-body)] text-[1rem] text-white/55">
              No promo video is configured for this board and class yet.
            </p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[14px] border border-white/10 bg-white/[0.04] px-4 py-3 [font-family:var(--font-bob-body)] text-[0.95rem] font-semibold text-white/80"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="rounded-[14px] border border-pink-500/45 bg-[#110f18] px-4 py-3 [font-family:var(--font-bob-display)] text-[0.95rem] font-bold text-pink-300"
          >
            Start Live Battle
          </button>
        </div>
      </div>
    </div>
  );
}

function extractYoutubeVideoId(value?: string | null) {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  const match = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)?([A-Za-z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

function QuizSessionPanel({
  currentQuestion,
  currentIndex,
  totalQuestions,
  mode,
  timeLeft,
  timerPercent,
  timerBarClassName,
  selectedBoard,
  selectedClass,
  selectedSubject,
  resultOverlay,
  onAnswer,
}: {
  currentQuestion: BattleQuestion;
  currentIndex: number;
  totalQuestions: number;
  mode: BattleMode;
  timeLeft: number;
  timerPercent: number;
  timerBarClassName: string;
  selectedBoard: BattleBoard;
  selectedClass: BattleClassLevel;
  selectedSubject: string;
  resultOverlay: { state: ResultState; correctAnswer: number } | null;
  onAnswer: (selectedAnswer: number | null, timedOut?: boolean) => void;
}) {
  return (
    <section className="relative rounded-[24px] border border-cyan-400/16 bg-[linear-gradient(180deg,#141923,#10141c)] p-5">
      {resultOverlay ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[24px] bg-[#06080d]/78 backdrop-blur-sm">
          <div
            className={cn(
              'rounded-[22px] border px-6 py-5 text-center shadow-[0_0_24px_rgba(0,0,0,0.35)]',
              resultOverlay.state === 'correct' && 'border-emerald-400/45 bg-[#0f2217]',
              resultOverlay.state === 'wrong' && 'border-pink-500/45 bg-[#2a111a]',
              resultOverlay.state === 'timeout' && 'border-amber-400/45 bg-[#2a210d]'
            )}
          >
            <p className="[font-family:var(--font-bob-display)] text-[1.7rem] font-bold text-white">
              {resultOverlay.state === 'correct'
                ? 'Correct ✅'
                : resultOverlay.state === 'wrong'
                  ? 'Wrong ❌'
                  : "Time's Up!"}
            </p>
            <p className="mt-2 [font-family:var(--font-bob-body)] text-[0.92rem] text-white/55">
              Correct answer: {currentQuestion.options[resultOverlay.correctAnswer]}
            </p>
          </div>
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4 text-cyan-300" />
          <h3 className="[font-family:var(--font-bob-display)] text-[1.5rem] font-bold text-white">
            {mode === 'live' ? 'Live Battle' : 'Practice Mode'}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 [font-family:var(--font-bob-body)] text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-cyan-300">
            {selectedBoard}
          </span>
          <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 [font-family:var(--font-bob-body)] text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-violet-200">
            {selectedClass}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 [font-family:var(--font-bob-body)] text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-white/65">
            {selectedSubject}
          </span>
        </div>
      </div>

      <div className="rounded-[18px] border border-cyan-400/12 bg-[#0d1218] p-4">
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/8">
          <div className={cn('h-full rounded-full transition-all', timerBarClassName)} style={{ width: `${timerPercent}%` }} />
        </div>

        <div className="mb-4 flex items-center justify-between [font-family:var(--font-bob-body)] text-[0.78rem] uppercase tracking-[0.16em] text-white/35">
          <span>
            Question {currentIndex + 1}/{totalQuestions}
          </span>
          <div className="flex items-center gap-2">
            {currentQuestion.isDiamond ? (
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-1 text-[#ffd400]">
                Diamond +5
              </span>
            ) : null}
            <span className="flex h-9 min-w-9 items-center justify-center rounded-full border border-cyan-400/30 px-2 text-cyan-200">
              {timeLeft}s
            </span>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 [font-family:var(--font-bob-body)] text-[0.8rem] text-white/60">
            {currentQuestion.difficulty.toUpperCase()}
          </span>
          <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 [font-family:var(--font-bob-body)] text-[0.8rem] text-white/60">
            {currentQuestion.subject}
          </span>
        </div>

        <h4 className="[font-family:var(--font-bob-display)] text-center text-[1.55rem] font-bold text-white">
          {currentQuestion.question}
        </h4>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {currentQuestion.options.map((label, index) => (
            <button
              key={label}
              type="button"
              disabled={Boolean(resultOverlay)}
              onClick={() => onAnswer(index)}
              className="rounded-[14px] border border-white/8 bg-white/[0.03] px-4 py-3 text-left [font-family:var(--font-bob-body)] text-[0.92rem] font-semibold text-white/80 transition hover:border-cyan-400/45 hover:bg-cyan-400/10 disabled:cursor-not-allowed"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuizSummaryPanel({
  mode,
  records,
  coinBalance,
  onRestart,
}: {
  mode: BattleMode;
  records: BattleAnswerRecord[];
  coinBalance: number;
  onRestart: () => void;
}) {
  const correct = records.filter((record) => record.isCorrect).length;
  const wrong = records.length - correct;
  const earnedCoins = records.reduce((sum, record) => sum + record.coinsEarned, 0);

  return (
    <section className="rounded-[24px] border border-cyan-400/16 bg-[linear-gradient(180deg,#141923,#10141c)] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="[font-family:var(--font-bob-body)] text-[0.78rem] uppercase tracking-[0.18em] text-cyan-300">
            {mode === 'live' ? 'Live Battle Complete' : 'Practice Complete'}
          </p>
          <h3 className="[font-family:var(--font-bob-display)] text-[2rem] font-bold text-white">
            Session Summary
          </h3>
        </div>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-[14px] border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 [font-family:var(--font-bob-display)] text-[0.95rem] font-bold text-cyan-200"
        >
          Back To Dashboard
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-4">
        {[
          ['Correct', String(correct)],
          ['Wrong', String(wrong)],
          ['Coins Earned', String(earnedCoins)],
          ['Balance', String(coinBalance)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[18px] border border-white/8 bg-black/25 p-4">
            <p className="[font-family:var(--font-bob-body)] text-[0.78rem] uppercase tracking-[0.16em] text-white/35">{label}</p>
            <p className="[font-family:var(--font-bob-display)] mt-2 text-[1.7rem] font-bold text-white">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function DashboardSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options?: string[];
  onChange?: (value: string) => void;
}) {
  if (options && onChange) {
    return (
      <label className="flex items-center justify-between gap-3">
        <span className="[font-family:var(--font-bob-body)] text-[0.86rem] text-white/40">{label}</span>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="rounded-[10px] border border-white/8 bg-white/[0.04] px-3 py-2 [font-family:var(--font-bob-body)] text-[0.85rem] font-semibold text-white"
        >
          {options.map((option) => (
            <option key={option} value={option} className="bg-[#11151d]">
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="[font-family:var(--font-bob-body)] text-[0.86rem] text-white/40">{label}</span>
      <span className="rounded-[10px] border border-white/8 bg-white/[0.04] px-3 py-2 [font-family:var(--font-bob-body)] text-[0.85rem] font-semibold text-white">
        {value}
      </span>
    </div>
  );
}
