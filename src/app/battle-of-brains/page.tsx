'use client';

import { useEffect, useState } from 'react';
import type { ReactNode, SVGProps } from 'react';
import Link from 'next/link';
import { Orbitron, Rajdhani } from 'next/font/google';
import {
  ArrowLeft,
  ArrowUp,
  BarChart3,
  Brain,
  Check,
  CirclePlay,
  Clock3,
  Coins,
  Dumbbell,
  Gem,
  Goal,
  Medal,
  MoveUp,
  Rocket,
  Shield,
  Shirt,
  ShoppingBag,
  Sparkles,
  Star,
  Timer,
  Trophy,
  UserCircle2,
  Zap,
  Lock,
  BookOpen,
  FileText,
  PauseCircle,
} from 'lucide-react';

import {
  BATTLE_LEVELS,
  BATTLE_SHOP_ITEMS,
  BOARD_OPTIONS,
  CLASS_OPTIONS,
  getBattleAnalytics,
  getBattleBadges,
  getBattleComputedStats,
  getBattleLevelState,
  getBattleProfile,
  purchaseBattleItem,
  type BattleBoard,
  type BattleClassLevel,
} from '@/lib/battleOfBrains';
import { cn } from '@/lib/utils';
import { useYTWallah } from '@/contexts/YTWallahContext';

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

const navItems = ['Home', 'Levels', 'Shop', 'Stats'] as const;
type BattleSection = (typeof navItems)[number];
const BATTLE_ENTRY_KEY = 'pw-studyverse-bob-entry';





export default function BattleOfBrainsPage() {
  const { siteSettings } = useYTWallah();
  const [activeSection, setActiveSection] = useState<BattleSection>('Home');
  const [selectedBoard, setSelectedBoard] = useState<BattleBoard>('CBSE');
  const [selectedClass, setSelectedClass] = useState<BattleClassLevel>('10th');
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [entryReady, setEntryReady] = useState(false);
  const [showDemoOverlay, setShowDemoOverlay] = useState(false);
  const [battleProfile, setBattleProfile] = useState(() => getBattleProfile());
  const [battleAnalytics, setBattleAnalytics] = useState(() => getBattleAnalytics());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(BATTLE_ENTRY_KEY);
    if (!saved) {
      setShowEntryModal(true);
      setEntryReady(true);
      return;
    }
    try {
      const parsed = JSON.parse(saved) as {
        board?: BattleBoard;
        classLevel?: BattleClassLevel;
      };
      if (parsed.board && BOARD_OPTIONS.includes(parsed.board)) setSelectedBoard(parsed.board);
      if (parsed.classLevel && CLASS_OPTIONS.includes(parsed.classLevel)) setSelectedClass(parsed.classLevel);
      setShowEntryModal(false);
    } catch {
      window.localStorage.removeItem(BATTLE_ENTRY_KEY);
      setShowEntryModal(true);
    }
    setEntryReady(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const refreshBattleState = () => {
      setBattleProfile(getBattleProfile());
      setBattleAnalytics(getBattleAnalytics());
    };

    refreshBattleState();
    window.addEventListener('storage', refreshBattleState);
    return () => window.removeEventListener('storage', refreshBattleState);
  }, []);

  const levelState = getBattleLevelState(battleProfile.totalQuestionsAnswered);
  const computedStats = getBattleComputedStats(battleProfile);
  const statCards = [
    { label: 'TOTAL XP', value: formatCompactNumber(computedStats.totalXp), tag: `+${computedStats.weeklyXp}`, accent: 'cyan', icon: Trophy },
    { label: 'ACCURACY', value: `${computedStats.accuracy.toFixed(1)}%`, tag: `${battleProfile.correctAnswers} Correct`, accent: 'green', icon: Goal },
    { label: 'CURRENT STREAK', value: `${computedStats.currentStreak}`, tag: `Best ${computedStats.bestStreak}`, accent: 'amber', icon: FlameIcon },
    { label: 'AVG SPEED', value: `${computedStats.avgSpeed.toFixed(1)}s`, tag: computedStats.avgSpeed <= 10 ? 'Fast' : 'Steady', accent: 'violet', icon: Zap },
  ] as const;
  const weeklyPoints = computedStats.weeklyPoints.length ? computedStats.weeklyPoints : [0];
  const xpPoints = computedStats.xpPoints.length ? computedStats.xpPoints : [0];
  const weeklyLabels = getRecentDayLabels();
  const xpLabels = xpPoints.length > 1
    ? xpPoints.map((_, index) => `Battle ${index + 1}`)
    : ['Start'];
  const weeklyYLabels = buildAxisLabels(Math.max(...weeklyPoints), 4);
  const xpYLabels = buildAxisLabels(Math.max(...xpPoints), 5, true);
  const totalSubjectAnswers = Math.max(
    1,
    computedStats.subjectAccuracy.reduce((sum, item) => sum + item.total, 0)
  );
  const subjectDistribution = (computedStats.subjectAccuracy.length
    ? computedStats.subjectAccuracy
    : [{ label: 'Mixed', accuracy: 0, correct: 0, total: 0 }]
  ).map((item, index) => ({
    label: item.label,
    value: Number(((item.total / totalSubjectAnswers) * 100).toFixed(1)),
    color: ['#1ed8e8', '#8a2be2', '#ffd400', '#00ff73', '#ff3d77'][index % 5],
  }));
  const highestSubjectTotal = Math.max(
    1,
    ...computedStats.subjectAccuracy.map((item) => item.correct)
  );
  const correctAnswers = computedStats.subjectAccuracy.map((item) => ({
    label: item.label,
    value: item.correct,
    width: Math.max(8, (item.correct / highestSubjectTotal) * 100),
  }));
  const fastAnswers = battleProfile.totalQuestionsAnswered
    ? Math.round((battleProfile.correctAnswers / Math.max(1, battleProfile.totalQuestionsAnswered)) * 0.35 * battleProfile.totalQuestionsAnswered)
    : 0;
  const mediumAnswers = battleProfile.totalQuestionsAnswered
    ? Math.round((battleProfile.correctAnswers / Math.max(1, battleProfile.totalQuestionsAnswered)) * 0.4 * battleProfile.totalQuestionsAnswered)
    : 0;
  const normalAnswers = Math.max(0, battleProfile.totalQuestionsAnswered - fastAnswers - mediumAnswers);
  const speedMetrics = [
    { title: 'Lightning Fast', range: '< 10s', value: fastAnswers, accent: 'green', icon: Zap },
    { title: 'Quick', range: '10s - 30s', value: mediumAnswers, accent: 'cyan', icon: Rocket },
    { title: 'Normal', range: '> 30s', value: normalAnswers, accent: 'muted', icon: Timer },
  ] as const;
  const achievements = [
    ...getBattleBadges(battleProfile, computedStats).slice(0, 3).map((badge) => ({
      title: badge.title,
      detail: badge.progressLabel,
      accent: badge.accent === 'muted' ? 'violet' : badge.accent,
      icon:
        badge.id === 'brainiac-king'
          ? CrownIcon
          : badge.id === 'speedster'
            ? Rocket
            : Star,
    })),
  ] as const;
  const activities = computedStats.recentActivities.map((item) => ({
    ...item,
    icon:
      item.accent === 'green'
        ? Trophy
        : item.accent === 'cyan'
          ? Dumbbell
          : item.accent === 'amber'
            ? Medal
            : ArrowUp,
  }));
  const levelCards = BATTLE_LEVELS.map((level, index) => {
    const isCompleted = index < levelState.currentLevelIndex;
    const isCurrent = index === levelState.currentLevelIndex;
    const isLocked = index > levelState.currentLevelIndex;
    return {
      name: level.name,
      icon:
        level.name === 'Bronze'
          ? Medal
          : level.name === 'Silver'
            ? FlameIcon
            : level.name === 'Diamond'
              ? Gem
              : isLocked
                ? Lock
                : Shield,
      caption: `${level.minQuestions}+ questions`,
      status: isCompleted ? 'COMPLETED' : isCurrent ? 'CURRENT' : 'LOCKED',
      progress: isCompleted ? 100 : isCurrent ? levelState.progressToNextLevel : 0,
      active: isCurrent,
      locked: isLocked,
      dotsCompleted: isCompleted ? 3 : isCurrent ? levelState.tierDotsCompleted : 0,
    };
  });
  const progressionPath = BATTLE_LEVELS.flatMap((level, levelIndex) =>
    [1, 2, 3].map((tierNumber, tierIndex) => {
      const tierMinQuestions = level.minQuestions + tierIndex * 10;
      const nextTierMinQuestions = level.minQuestions + (tierIndex + 1) * 10;
      const isCompleted = battleProfile.totalQuestionsAnswered >= nextTierMinQuestions;
      const isCurrent =
        !isCompleted &&
        battleProfile.totalQuestionsAnswered >= tierMinQuestions &&
        (levelIndex === levelState.currentLevelIndex ||
          battleProfile.totalQuestionsAnswered < nextTierMinQuestions);
      return {
        label: `${level.name} ${tierNumber}`,
        detail: `${Math.max(0, Math.min(10, battleProfile.totalQuestionsAnswered - tierMinQuestions))}/10 questions`,
        progress: isCompleted
          ? 100
          : Math.max(
              0,
              Math.min(100, ((battleProfile.totalQuestionsAnswered - tierMinQuestions) / 10) * 100)
            ),
        status: isCompleted ? 'Completed' : isCurrent ? 'Current' : 'Locked',
        accent: isCompleted ? 'amber' : isCurrent ? 'cyan' : 'muted',
      };
    })
  );
  const demoVideoId = extractYoutubeVideoId(siteSettings.battleOfBrainsDemoVideoId);

  const shopInventory = BATTLE_SHOP_ITEMS.map((item) => ({
    ...item,
    owned: battleProfile.ownedShopItemIds.includes(item.id),
    affordable: battleProfile.coins >= item.cost,
  }));

  const handleEntryContinue = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        BATTLE_ENTRY_KEY,
        JSON.stringify({ board: selectedBoard, classLevel: selectedClass })
      );
    }
    setShowEntryModal(false);
  };

  const handlePurchase = (itemId: string) => {
    const result = purchaseBattleItem(itemId);
    if (result.status === 'purchased' || result.status === 'owned' || result.status === 'locked') {
      setBattleProfile(result.profile);
    }
  };

  return (
    <main
      className={cn(
        orbitron.variable,
        rajdhani.variable,
        activeSection === 'Home'
          ? 'h-dvh overflow-y-auto overflow-x-hidden bg-[#06080d] px-0 py-0 text-white'
          : 'min-h-screen overflow-x-hidden bg-[#06080d] px-2 py-2 text-white sm:px-3 lg:px-4'
      )}
    >
      {entryReady && showEntryModal ? (
        <BattleEntryModal
          board={selectedBoard}
          classLevel={selectedClass}
          onBoardChange={setSelectedBoard}
          onClassChange={setSelectedClass}
          onContinue={handleEntryContinue}
        />
      ) : null}
      {showDemoOverlay ? (
        <DemoVideoOverlay
          demoVideoId={demoVideoId}
          onClose={() => setShowDemoOverlay(false)}
        />
      ) : null}
      <div className="mx-auto w-full max-w-[1960px]">
          <div
            className={cn(
              'mx-auto max-w-[1960px] overflow-hidden border border-cyan-400/12 bg-[linear-gradient(180deg,#0f121b,#0c1119)] shadow-[0_16px_72px_rgba(0,0,0,0.56)]',
              activeSection === 'Home' ? 'min-h-dvh rounded-none' : 'rounded-[20px]'
            )}
          >
            <TopBar
              activeSection={activeSection}
              onSelect={setActiveSection}
              coins={battleProfile.coins}
              levelLabel={`${levelState.currentLevel.name} T${levelState.currentTier}`}
            />

            <div
              className={cn(
                'border-t border-white/6 bg-[radial-gradient(circle_at_top_left,rgba(33,214,255,0.08),transparent_26%),radial-gradient(circle_at_top,rgba(145,54,255,0.1),transparent_30%),linear-gradient(180deg,#101521,#111622_50%,#131a28)] px-2 pb-2 pt-[96px] sm:px-3 lg:px-4 lg:pb-2 lg:pt-[92px]',
                activeSection === 'Home' && 'min-h-[calc(100dvh-88px)] px-2 pb-3 pt-[96px]'
              )}
            >
              <div className="space-y-2.5">
                {activeSection === 'Home' ? (
                  <HeroSection
                    selectedBoard={selectedBoard}
                    selectedClass={selectedClass}
                    activePlayers={battleAnalytics.totalUsers}
                    questionsSolved={battleAnalytics.totalQuestionsSolved}
                    currentStreak={computedStats.currentStreak}
                    onWatchDemo={() => setShowDemoOverlay(true)}
                  />
                ) : null}

                {activeSection === 'Levels' ? (
                <SectionShell id="levels-map">
                <SectionHeader
                  icon={<Trophy className="h-7 w-7 text-[#ffd400]" />}
                  title="Levels Map"
                  subtitle="Your progression through the ranks"
                  aside={
                    <div className="rounded-[20px] border border-cyan-400/25 bg-[#131a25] px-7 py-4 shadow-[inset_0_0_0_1px_rgba(0,217,255,0.05)]">
                      <p className="[font-family:var(--font-bob-body)] text-sm font-semibold text-white/45">Current Tier</p>
                       <p className="[font-family:var(--font-bob-display)] text-[1.75rem] font-bold text-transparent bg-[linear-gradient(90deg,#18def0,#8b2ff8)] bg-clip-text">
                        {levelState.currentLevel.name} Tier {levelState.currentTier}
                       </p>
                    </div>
                  }
                />

                <div className="grid gap-5 lg:grid-cols-4">
                  {levelCards.map((level) => {
                    const Icon = level.icon;
                    return (
                      <div
                        key={level.name}
                        className={cn(
                          'rounded-[24px] border p-7',
                          level.active
                            ? 'border-cyan-300/60 bg-[linear-gradient(180deg,#111b23,#121924)] shadow-[0_0_30px_rgba(20,227,255,0.55)]'
                            : level.locked
                              ? 'border-white/7 bg-[linear-gradient(180deg,#171920,#171922)] opacity-45'
                              : 'border-amber-400/35 bg-[linear-gradient(180deg,#1b1a14,#1a1917)]'
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div
                            className={cn(
                              'flex h-20 w-20 items-center justify-center rounded-[18px] border',
                              level.active && 'border-cyan-300/70 bg-cyan-400/10',
                              !level.active && !level.locked && 'border-amber-400/55 bg-amber-400/10',
                              level.locked && 'border-white/10 bg-white/5'
                            )}
                          >
                            <Icon
                              className={cn(
                                'h-9 w-9',
                                level.active && 'text-cyan-300',
                                !level.active && !level.locked && 'text-[#ffd400]',
                                level.locked && 'text-white/35'
                              )}
                            />
                          </div>
                          <div className="flex gap-1.5">
                            {Array.from({ length: 3 }).map((_, index) => (
                              <span
                                key={`${level.name}-${index}`}
                                className={cn(
                                  'h-4 w-4 rounded-full border',
                                  index < level.dotsCompleted
                                    ? level.active
                                      ? 'border-cyan-300 bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.6)]'
                                      : 'border-[#ffd400] bg-[#ffd400]'
                                    : 'border-white/18 bg-transparent'
                                )}
                              />
                            ))}
                          </div>
                        </div>

                        <h3 className="mt-7 [font-family:var(--font-bob-display)] text-[2.05rem] font-bold leading-none text-white">{level.name}</h3>
                        <p className="[font-family:var(--font-bob-body)] text-lg text-white/28">{level.caption}</p>

                        <div className="mt-8 h-4 overflow-hidden rounded-full bg-black/70">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              level.active && 'bg-[linear-gradient(90deg,#1ce0ef,#8734f5)]',
                              !level.active && !level.locked && 'bg-[#ffd400]'
                            )}
                            style={{ width: `${level.progress}%` }}
                          />
                        </div>

                        <p
                          className={cn(
                            'mt-4 [font-family:var(--font-bob-body)] text-xl font-bold uppercase tracking-[0.02em]',
                            level.active && 'text-cyan-300',
                            !level.active && !level.locked && 'text-[#ffd400]',
                            level.locked && 'text-white/30'
                          )}
                        >
                          {level.status}
                        </p>
                      </div>
                    );
                  })}
                </div>

              <div className="mt-10 rounded-[24px] border border-violet-500/28 bg-[#141821] px-6 py-6 sm:px-8">
                <div className="mb-6 flex items-center gap-3">
                  <BarChart3 className="h-7 w-7 text-[#9a36ff]" />
                  <h3 className="[font-family:var(--font-bob-display)] text-[1.75rem] font-bold text-white">
                    Detailed Progression Path
                  </h3>
                </div>

                <div className="space-y-4">
                  {progressionPath.map((step, index) => (
                    <div key={step.label} className="rounded-[20px] border border-white/6 bg-[#12161f] px-5 py-4">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                        <div
                          className={cn(
                            'flex h-20 w-20 items-center justify-center rounded-[18px] border',
                            step.accent === 'amber' && 'border-[#ffd400]/70 bg-[#ffd400]/12 shadow-[0_0_18px_rgba(255,212,0,0.25)]',
                            step.accent === 'cyan' && 'border-cyan-300/60 bg-cyan-300/10 shadow-[0_0_18px_rgba(28,224,239,0.22)]',
                            step.accent === 'muted' && 'border-white/10 bg-white/5'
                          )}
                        >
                          {step.accent === 'muted' ? (
                            <Shield className="h-9 w-9 text-white/30" />
                          ) : (
                            <Check
                              className={cn(
                                'h-10 w-10',
                                step.accent === 'amber' && 'text-[#ffd400]',
                                step.accent === 'cyan' && 'text-cyan-300'
                              )}
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                              <p className="[font-family:var(--font-bob-display)] text-[1.8rem] font-bold text-white">
                                {step.label}
                              </p>
                              <p className="[font-family:var(--font-bob-body)] text-lg text-white/32">
                                {step.detail}
                              </p>
                            </div>
                            <span
                              className={cn(
                                'inline-flex rounded-full px-5 py-2 [font-family:var(--font-bob-body)] text-base font-bold',
                                step.accent === 'amber' && 'bg-[#ffd400]/14 text-[#ffd400]',
                                step.accent === 'cyan' && 'bg-cyan-300/12 text-cyan-300',
                                step.accent === 'muted' && 'bg-white/8 text-white/35'
                              )}
                            >
                              {step.status}
                            </span>
                          </div>

                          <div className="mt-4 h-4 overflow-hidden rounded-full bg-black/70">
                            <div
                              className={cn(
                                'h-full rounded-full',
                                step.accent === 'amber' && 'bg-[#ffd400]',
                                step.accent === 'cyan' && 'bg-[linear-gradient(90deg,#1ce0ef,#8734f5)]'
                              )}
                              style={{ width: `${step.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      {index < progressionPath.length - 1 ? (
                        <div className="mt-4 ml-10 h-5 w-px bg-white/10" />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
              </SectionShell>
                ) : null}

            {activeSection === 'Shop' ? (
            <SectionShell id="shop">
              <SectionHeader
                icon={<ShoppingBag className="h-7 w-7 text-[#ffd400]" />}
                title="Coin Shop"
                subtitle="Power-ups, boosts, and exclusive items"
                aside={
                  <div className="rounded-[20px] border border-[#ffd400]/30 bg-[#15161d] px-7 py-4 shadow-[0_0_22px_rgba(255,212,0,0.24)]">
                    <p className="[font-family:var(--font-bob-body)] text-sm font-semibold text-white/45">Your Balance</p>
                    <div className="mt-2 flex items-center gap-3">
                      <Coins className="h-8 w-8 text-[#ffd400]" />
                      <span className="[font-family:var(--font-bob-display)] text-[1.85rem] font-bold text-[#ffd400]">
                        {battleProfile.coins}
                      </span>
                    </div>
                  </div>
                }
              />

              <div className="grid gap-5 xl:grid-cols-4">
                {shopInventory.map((item) => (
                  <ShopCard
                    key={item.id}
                    title={item.title}
                    subtitle={item.description}
                    accent={
                      item.id === 'bob-cap'
                        ? 'green'
                        : item.id === 'bob-tshirt'
                          ? 'violet'
                          : item.id === 'study-guide-book'
                            ? 'amber'
                            : 'gradient'
                    }
                    metaLabel="STATUS"
                    metaValue={item.owned ? 'Owned' : item.affordable ? 'Available' : 'Locked'}
                    price={String(item.cost)}
                    status={item.owned ? 'owned' : item.affordable ? 'available' : 'locked'}
                    actionLabel={item.owned ? 'Owned' : item.affordable ? 'Buy Now' : 'Locked'}
                    onAction={() => handlePurchase(item.id)}
                    iconName={item.icon}
                  />
                ))}
              </div>

              <div className="mt-8 rounded-[22px] border border-cyan-400/25 bg-[#131822] px-5 py-5 sm:px-6">
                <div className="mb-5 flex items-center gap-3">
                  <Gem className="h-6 w-6 text-cyan-300" />
                  <h3 className="[font-family:var(--font-bob-display)] text-[1.9rem] font-bold text-white">
                    Coin Rules
                  </h3>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  {[
                    '3 Diamond questions per session',
                    '1 easy, 1 medium, and 1 hard diamond question',
                    '5 coins for every correct diamond answer',
                  ].map((rule) => (
                    <div
                      key={rule}
                      className="rounded-[18px] border border-white/8 bg-black/80 px-5 py-6"
                    >
                      <div className="flex items-center gap-3">
                        <Gem className="h-5 w-5 text-cyan-300" />
                        <p className="[font-family:var(--font-bob-body)] text-[1rem] font-semibold text-white/78">
                          {rule}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionShell>
            ) : null}

            {activeSection === 'Stats' ? (
            <SectionShell id="stats">
              <SectionHeader
                icon={<BarChart3 className="h-7 w-7 text-violet-400" />}
                title="Comprehensive Stats"
                subtitle="Your complete performance analytics"
                aside={
                  <div className="flex items-center gap-3 rounded-[18px] border border-white/8 bg-[#161b24] px-5 py-3">
                    <span className="[font-family:var(--font-bob-body)] text-[1.1rem] font-semibold text-white/80">Last 7 Days</span>
                    <span className="text-white/50">⌄</span>
                  </div>
                }
              />

              <div className="grid gap-5 lg:grid-cols-4">
                {statCards.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className={cn(
                        'rounded-[20px] border bg-[#151a24] px-6 py-6',
                        item.accent === 'cyan' && 'border-cyan-400/28',
                        item.accent === 'green' && 'border-emerald-400/28',
                        item.accent === 'amber' && 'border-[#ffd400]/25',
                        item.accent === 'violet' && 'border-violet-500/28'
                      )}
                    >
                      <div className="mb-8 flex items-start justify-between gap-4">
                        <div
                          className={cn(
                            'flex h-[72px] w-[72px] items-center justify-center rounded-[18px] border',
                            item.accent === 'cyan' && 'border-cyan-400/55 bg-cyan-400/10',
                            item.accent === 'green' && 'border-emerald-400/55 bg-emerald-400/10',
                            item.accent === 'amber' && 'border-[#ffd400]/45 bg-[#ffd400]/10',
                            item.accent === 'violet' && 'border-violet-500/55 bg-violet-500/10'
                          )}
                        >
                          <Icon
                            className={cn(
                              'h-8 w-8',
                              item.accent === 'cyan' && 'text-cyan-300',
                              item.accent === 'green' && 'text-emerald-400',
                              item.accent === 'amber' && 'text-[#ffd400]',
                              item.accent === 'violet' && 'text-violet-400'
                            )}
                          />
                        </div>

                        <span
                          className={cn(
                            'rounded-full px-4 py-2 [font-family:var(--font-bob-body)] text-base font-bold',
                            item.accent === 'cyan' && 'bg-cyan-400/15 text-cyan-300',
                            item.accent === 'green' && 'bg-emerald-400/15 text-emerald-400',
                            item.accent === 'amber' && 'bg-[#ffd400]/14 text-[#ffd400]',
                            item.accent === 'violet' && 'bg-violet-500/14 text-violet-400'
                          )}
                        >
                          {item.tag}
                        </span>
                      </div>
                      <p className="[font-family:var(--font-bob-body)] text-[1.1rem] tracking-[0.08em] text-white/38">{item.label}</p>
                      <p className="[font-family:var(--font-bob-display)] text-[2.8rem] font-bold leading-none text-white">{item.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                <ChartCard title="Weekly Performance" icon={<BarChart3 className="h-6 w-6 text-cyan-300" />}>
                  <LineAreaChart
                    points={weeklyPoints}
                    color="#19e6ff"
                    fill="rgba(25,230,255,0.12)"
                    yLabels={weeklyYLabels}
                    xLabels={weeklyLabels}
                  />
                </ChartCard>

                <ChartCard title="Subject Distribution" icon={<PieIcon className="h-6 w-6 text-violet-400" />}>
                  <PieCard subjectDistribution={subjectDistribution} />
                </ChartCard>
              </div>

              <div className="mt-5">
                <ChartCard title="XP Progress Over Time" icon={<BarChart3 className="h-6 w-6 text-[#ffd400]" />}>
                  <LineAreaChart
                    points={xpPoints}
                    color="#ffd400"
                    fill="rgba(255,212,0,0.10)"
                    yLabels={xpYLabels}
                    xLabels={xpLabels}
                  />
                </ChartCard>
              </div>

              <div className="mt-8 grid gap-5 xl:grid-cols-3">
                <PanelCard title="Correct Answers" icon={<Check className="h-6 w-6 text-emerald-400" />}>
                  <div className="space-y-6">
                    {correctAnswers.length ? correctAnswers.map((item) => (
                      <div key={item.label}>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="[font-family:var(--font-bob-body)] text-[1.25rem] text-white/60">{item.label}</span>
                          <span className="[font-family:var(--font-bob-display)] text-[1.5rem] font-bold text-white">{item.value}</span>
                        </div>
                        <div className="h-4 overflow-hidden rounded-full bg-black/75">
                          <div className="h-full rounded-full bg-[#00ff73]" style={{ width: `${item.width}%` }} />
                        </div>
                      </div>
                    )) : (
                      <p className="[font-family:var(--font-bob-body)] text-lg text-white/55">
                        Answer a few questions to unlock subject-wise correct answer stats.
                      </p>
                    )}
                  </div>
                </PanelCard>

                <PanelCard title="Speed Metrics" icon={<Clock3 className="h-6 w-6 text-cyan-300" />}>
                  <div className="space-y-5">
                    {speedMetrics.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.title}
                          className={cn(
                            'rounded-[18px] border bg-black/80 px-6 py-5',
                            item.accent === 'green' && 'border-emerald-500/35',
                            item.accent === 'cyan' && 'border-cyan-400/35',
                            item.accent === 'muted' && 'border-white/8'
                          )}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <Icon
                                className={cn(
                                  'h-8 w-8',
                                  item.accent === 'green' && 'text-emerald-400',
                                  item.accent === 'cyan' && 'text-cyan-300',
                                  item.accent === 'muted' && 'text-white/55'
                                )}
                              />
                              <div>
                                <p className="[font-family:var(--font-bob-display)] text-[1.45rem] font-bold text-white">
                                  {item.title}
                                </p>
                                <p className="[font-family:var(--font-bob-body)] text-lg text-white/35">{item.range}</p>
                              </div>
                            </div>
                            <span
                              className={cn(
                                '[font-family:var(--font-bob-display)] text-[2.2rem] font-bold',
                                item.accent === 'green' && 'text-emerald-400',
                                item.accent === 'cyan' && 'text-cyan-300',
                                item.accent === 'muted' && 'text-white'
                              )}
                            >
                              {item.value}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </PanelCard>

                <PanelCard title="Achievements" icon={<Medal className="h-6 w-6 text-[#ffd400]" />}>
                  <div className="space-y-5">
                    {achievements.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.title}
                          className={cn(
                            'flex items-center gap-5 rounded-[18px] border bg-black/80 px-5 py-5',
                            item.accent === 'amber' && 'border-[#ffd400]/35',
                            item.accent === 'cyan' && 'border-cyan-400/35',
                            item.accent === 'violet' && 'border-violet-500/35'
                          )}
                        >
                          <div
                            className={cn(
                              'flex h-[72px] w-[72px] items-center justify-center rounded-[16px] border',
                              item.accent === 'amber' && 'border-[#ffd400]/55 bg-[#ffd400]/10',
                              item.accent === 'cyan' && 'border-cyan-400/55 bg-cyan-400/10',
                              item.accent === 'violet' && 'border-violet-500/55 bg-violet-500/10'
                            )}
                          >
                            <Icon
                              className={cn(
                                'h-8 w-8',
                                item.accent === 'amber' && 'text-[#ffd400]',
                                item.accent === 'cyan' && 'text-cyan-300',
                                item.accent === 'violet' && 'text-violet-400'
                              )}
                            />
                          </div>
                          <div>
                            <p className="[font-family:var(--font-bob-display)] text-[1.45rem] font-bold text-white">
                              {item.title}
                            </p>
                            <p className="[font-family:var(--font-bob-body)] text-lg text-white/35">{item.detail}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </PanelCard>
              </div>

              <div className="mt-8 rounded-[22px] border border-white/8 bg-[#151b24] p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <MoveUp className="h-7 w-7 text-cyan-300" />
                  <h3 className="[font-family:var(--font-bob-display)] text-[1.95rem] font-bold text-white">
                    Recent Activity
                  </h3>
                </div>

                <div className="space-y-5">
                  {activities.length ? activities.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="flex flex-col gap-4 rounded-[18px] border border-cyan-400/15 bg-black/75 px-5 py-5 lg:flex-row lg:items-center lg:justify-between"
                      >
                        <div className="flex items-center gap-5">
                          <div
                            className={cn(
                              'flex h-16 w-16 items-center justify-center rounded-[16px] border',
                              item.accent === 'green' && 'border-emerald-400/55 bg-emerald-400/10',
                              item.accent === 'cyan' && 'border-cyan-400/55 bg-cyan-400/10',
                              item.accent === 'amber' && 'border-[#ffd400]/50 bg-[#ffd400]/10',
                              item.accent === 'violet' && 'border-violet-500/55 bg-violet-500/10'
                            )}
                          >
                            <Icon
                              className={cn(
                                'h-7 w-7',
                                item.accent === 'green' && 'text-emerald-400',
                                item.accent === 'cyan' && 'text-cyan-300',
                                item.accent === 'amber' && 'text-[#ffd400]',
                                item.accent === 'violet' && 'text-violet-400'
                              )}
                            />
                          </div>
                          <div>
                            <p className="[font-family:var(--font-bob-display)] text-[1.45rem] font-bold text-white">
                              {item.title}
                            </p>
                            <p className="[font-family:var(--font-bob-body)] text-lg text-white/35">{item.detail}</p>
                          </div>
                        </div>
                        <span className="[font-family:var(--font-bob-body)] text-lg font-semibold text-white/32">
                          {item.time}
                        </span>
                      </div>
                    );
                  }) : (
                    <div className="rounded-[18px] border border-cyan-400/15 bg-black/75 px-5 py-5">
                      <p className="[font-family:var(--font-bob-body)] text-lg text-white/55">
                        Your recent battles, wins, and rewards will appear here once you start playing.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </SectionShell>
            ) : null}
              </div>
            </div>
          </div>
      </div>
    </main>
  );
}

function TopBar({
  activeSection,
  onSelect,
  coins,
  levelLabel,
}: {
  activeSection: BattleSection;
  onSelect: (section: BattleSection) => void;
  coins: number;
  levelLabel: string;
}) {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 mx-auto flex w-full max-w-[1960px] flex-col gap-2 border-b border-white/6 bg-[#12151d]/58 px-3 py-3 backdrop-blur-xl sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">
      <Link href="/battle-of-brains" className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#1fe7ff,#9238ff,#ffcb1f)] shadow-[0_0_20px_rgba(30,231,255,0.5)]">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div className="flex items-center gap-3">
          <span className="[font-family:var(--font-bob-display)] text-[1.95rem] font-black tracking-[-0.08em] text-white">
            BOB
          </span>
          <span className="[font-family:var(--font-bob-display)] text-[1.15rem] font-bold uppercase tracking-[-0.04em] text-cyan-300">
            Battle Of Brain
          </span>
        </div>
      </Link>

      <nav className="flex items-center gap-3 overflow-x-auto pb-1 lg:gap-10">
        {navItems.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onSelect(item)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1 [font-family:var(--font-bob-body)] text-[0.95rem] font-semibold transition hover:text-white/75',
              activeSection === item
                ? 'bg-cyan-400/12 text-cyan-300'
                : 'text-white/45 hover:bg-white/5'
            )}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 [font-family:var(--font-bob-body)] text-[0.82rem] font-semibold text-white/80"
        >
          <ArrowLeft className="h-4 w-4" />
          Return To Study Verse
        </Link>
        <div className="flex items-center gap-3 rounded-full border border-[#ffd400]/25 bg-[#ffd400]/10 px-5 py-2.5 shadow-[0_0_18px_rgba(255,212,0,0.38)]">
          <Coins className="h-5 w-5 text-[#ffd400]" />
          <span className="[font-family:var(--font-bob-display)] text-[1.7rem] font-bold text-[#ffd400]">{coins}</span>
        </div>
        <div className="rounded-full border border-violet-500/25 bg-violet-500/8 px-4 py-2.5 [font-family:var(--font-bob-display)] text-[1rem] font-bold text-violet-300">
          {levelLabel}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/35 bg-[radial-gradient(circle_at_50%_20%,#3be7ff,#14233a)] shadow-[0_0_16px_rgba(20,227,255,0.3)]">
          <UserCircle2 className="h-7 w-7 text-white" />
        </div>
      </div>
    </header>
  );
}

function HeroSection({
  selectedBoard,
  selectedClass,
  activePlayers,
  questionsSolved,
  currentStreak,
  onWatchDemo,
}: {
  selectedBoard: BattleBoard;
  selectedClass: BattleClassLevel;
  activePlayers: number;
  questionsSolved: number;
  currentStreak: number;
  onWatchDemo: () => void;
}) {
  const heroStats = [
    { value: formatCompactNumber(activePlayers), label: 'Active Players', accent: 'cyan' },
    {
      value: formatCompactNumber(questionsSolved),
      label: 'Questions Solved',
      accent: 'violet',
    },
    { value: String(currentStreak), label: 'Current Streak', accent: 'amber' },
  ] as const;

  return (
    <section
      id="top"
      className="relative flex min-h-[calc(100dvh-112px)] items-center rounded-[20px] border border-cyan-300/10 bg-[radial-gradient(circle_at_top,#1f3551,transparent_38%),radial-gradient(circle_at_bottom_left,rgba(155,55,255,0.22),transparent_30%),linear-gradient(180deg,#20364a,#271d44_62%,#171923)] px-3 py-3 text-center sm:px-4 lg:min-h-[calc(100dvh-104px)] lg:px-5 lg:py-4"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_30%)]" />

      <div className="relative mx-auto flex w-full max-w-[1020px] flex-col justify-center">
        <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#1fe7ff,#9138ff,#ffc71f)] shadow-[0_0_16px_rgba(30,231,255,0.45)] sm:h-20 sm:w-20">
          <Brain className="h-8 w-8 text-white sm:h-9 sm:w-9" />
          <div className="absolute ml-[56px] mt-[-46px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#362b00] bg-[#ffd400] sm:ml-[64px] sm:mt-[-52px]">
            <Zap className="h-3 w-3 text-black" />
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full border border-cyan-400/18 bg-cyan-400/10 px-2.5 py-1 [font-family:var(--font-bob-body)] text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-cyan-300">
            Board: {selectedBoard}
          </span>
          <span className="rounded-full border border-violet-400/18 bg-violet-500/10 px-2.5 py-1 [font-family:var(--font-bob-body)] text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-violet-200">
            Class: {selectedClass}
          </span>
        </div>

        <h1 className="mt-2.5 [font-family:var(--font-bob-display)] text-[2.1rem] font-black uppercase tracking-[-0.08em] text-transparent bg-[linear-gradient(90deg,#12e9ff,#5c9cff,#8c49ff)] bg-clip-text sm:text-[2.9rem] lg:text-[3.6rem]">
          Battle Of Brain
        </h1>
        <p className="[font-family:var(--font-bob-body)] text-[0.95rem] text-white/38 sm:text-[1.08rem] lg:text-[1.15rem]">
          AI-Powered Quiz Platform · Compete Globally · Level Up Your
        </p>
        <p className="[font-family:var(--font-bob-body)] text-[0.95rem] text-white/38 sm:text-[1.08rem] lg:text-[1.15rem]">Knowledge</p>

        <div className="mt-3.5 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Link
            href="/battle-of-brains/dashboard"
            className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-[14px] bg-cyan-400 px-4.5 py-2 [font-family:var(--font-bob-display)] text-[0.95rem] font-bold text-black shadow-[0_0_14px_rgba(30,231,255,0.6)] transition hover:scale-[1.01]"
          >
            <Rocket className="h-4.5 w-4.5" />
            Get Started
          </Link>
          <button
            type="button"
            onClick={onWatchDemo}
            className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-[14px] border border-violet-500/75 bg-violet-500/6 px-4.5 py-2 [font-family:var(--font-bob-display)] text-[0.95rem] font-bold text-white shadow-[0_0_14px_rgba(138,43,226,0.25)]"
          >
            <CirclePlay className="h-4.5 w-4.5" />
            Watch Demo
          </button>
        </div>

        <div className="mt-3.5 grid gap-2 sm:grid-cols-3">
          {heroStats.map((item) => (
            <div key={item.label} className="rounded-[15px] border border-white/6 bg-[#191722]/85 px-3 py-3">
              <p
                className={cn(
                  '[font-family:var(--font-bob-display)] text-[1.62rem] font-bold leading-none',
                  item.accent === 'cyan' && 'text-cyan-300',
                  item.accent === 'violet' && 'text-violet-400',
                  item.accent === 'amber' && 'text-[#ffd400]'
                )}
              >
                {item.value}
              </p>
              <p className="[font-family:var(--font-bob-body)] text-[0.82rem] text-white/35">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BattleEntryModal({
  board,
  classLevel,
  onBoardChange,
  onClassChange,
  onContinue,
}: {
  board: BattleBoard;
  classLevel: BattleClassLevel;
  onBoardChange: (board: BattleBoard) => void;
  onClassChange: (classLevel: BattleClassLevel) => void;
  onContinue: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#05070d]/82 px-4 backdrop-blur-md">
      <div className="w-full max-w-[560px] rounded-[28px] border border-cyan-400/18 bg-[linear-gradient(180deg,#131723,#10131d)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#1fe7ff,#9238ff,#ffcb1f)] shadow-[0_0_20px_rgba(30,231,255,0.42)]">
            <Brain className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="[font-family:var(--font-bob-body)] text-sm uppercase tracking-[0.25em] text-cyan-300/80">
              Battle Entry
            </p>
            <h2 className="[font-family:var(--font-bob-display)] text-[2rem] font-bold text-white">
              Choose Your Board & Class
            </h2>
          </div>
        </div>

        <p className="mt-4 [font-family:var(--font-bob-body)] text-[1.05rem] text-white/45">
          Set your learning profile before entering Battle Of Brains.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
            <span className="[font-family:var(--font-bob-body)] text-sm uppercase tracking-[0.2em] text-white/40">
              Board
            </span>
            <select
              value={board}
              onChange={(event) => onBoardChange(event.target.value as BattleBoard)}
              className="mt-3 w-full rounded-[14px] border border-cyan-400/15 bg-[#0d1119] px-4 py-3 [font-family:var(--font-bob-body)] text-lg font-semibold text-white outline-none"
            >
              {BOARD_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-[#0d1119]">
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
            <span className="[font-family:var(--font-bob-body)] text-sm uppercase tracking-[0.2em] text-white/40">
              Class
            </span>
            <select
              value={classLevel}
              onChange={(event) => onClassChange(event.target.value as BattleClassLevel)}
              className="mt-3 w-full rounded-[14px] border border-cyan-400/15 bg-[#0d1119] px-4 py-3 [font-family:var(--font-bob-body)] text-lg font-semibold text-white outline-none"
            >
              {CLASS_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-[#0d1119]">
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="mt-6 inline-flex w-full items-center justify-center rounded-[18px] bg-[linear-gradient(90deg,#1fe7ff,#7d47ff)] px-6 py-4 [font-family:var(--font-bob-display)] text-[1.15rem] font-bold text-white shadow-[0_0_22px_rgba(30,231,255,0.3)]"
        >
          Continue To Battle Of Brains
        </button>
      </div>
    </div>
  );
}

function SectionShell({
  children,
  id,
}: {
  children: ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="rounded-[24px] border border-cyan-400/12 bg-[linear-gradient(180deg,#171824,#151a25)] px-4 py-5 sm:px-6 lg:px-7 lg:py-6"
    >
      {children}
    </section>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
  aside,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="[font-family:var(--font-bob-display)] text-[2.7rem] font-bold leading-none text-white sm:text-[3rem]">
            {title}
          </h2>
        </div>
        <p className="mt-2 [font-family:var(--font-bob-body)] text-[1.25rem] text-white/30">{subtitle}</p>
      </div>
      {aside}
    </div>
  );
}

function ShopCard({
  title,
  subtitle,
  accent,
  metaLabel,
  metaValue,
  price,
  badge,
  status,
  actionLabel,
  onAction,
  iconName,
}: {
  title: string;
  subtitle: string;
  accent: 'green' | 'violet' | 'amber' | 'gradient';
  metaLabel: string;
  metaValue: string;
  price: string;
  badge?: string;
  status?: 'owned' | 'available' | 'locked';
  actionLabel?: string;
  onAction?: () => void;
  iconName?: string;
}) {
  const icon =
    iconName === 'cap'
      ? <CapIcon className="h-9 w-9 text-emerald-400" />
      : iconName === 'shirt'
        ? <Shirt className="h-9 w-9 text-violet-400" />
        : iconName === 'book'
          ? <BookOpen className="h-9 w-9 text-[#ffd400]" />
          : iconName === 'paper'
            ? <FileText className="h-9 w-9 text-white" />
            : title === 'Hint'
      ? <Sparkles className="h-9 w-9 text-emerald-400" />
      : title === 'Shield'
        ? <Shield className="h-9 w-9 text-violet-400" />
        : title === 'Double Coin'
          ? <Coins className="h-9 w-9 text-[#ffd400]" />
          : <ShoppingBag className="h-9 w-9 text-white" />;

  return (
    <div
      className={cn(
        'relative rounded-[24px] border bg-[#171923] px-7 py-8',
        accent === 'green' && 'border-emerald-500/28',
        accent === 'violet' && 'border-violet-500/28',
        accent === 'amber' && 'border-[#ffd400]/25',
        accent === 'gradient' && 'border-white/10'
      )}
    >
      {badge ? (
        <span className="absolute right-5 top-4 rounded-full bg-[#ffd400] px-4 py-1 [font-family:var(--font-bob-body)] text-base font-bold text-black">
          {badge}
        </span>
      ) : null}

      <div
        className={cn(
          'mx-auto flex h-28 w-28 items-center justify-center rounded-[20px] border',
          accent === 'green' && 'border-emerald-500/45 bg-emerald-500/12',
          accent === 'violet' && 'border-violet-500/45 bg-violet-500/12',
          accent === 'amber' && 'border-[#ffd400]/45 bg-[#ffd400]/10',
          accent === 'gradient' && 'border-white/25 bg-[linear-gradient(135deg,#1fe7ff,#8d39ff,#ffc71f)]'
        )}
      >
        {icon}
      </div>

      <h3 className="mt-6 text-center [font-family:var(--font-bob-display)] text-[2rem] font-bold text-white">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-[280px] text-center [font-family:var(--font-bob-body)] text-[1.35rem] text-white/32">
        {subtitle}
      </p>

      <div className="mt-7">
        <p className="[font-family:var(--font-bob-body)] text-[1rem] text-white/26">{metaLabel}</p>
        <p className="[font-family:var(--font-bob-body)] text-[1.25rem] font-semibold text-white">{metaValue}</p>
      </div>

      <div className="mt-7 flex items-center justify-center gap-3">
        <Coins className="h-8 w-8 text-[#ffd400]" />
        <span className="[font-family:var(--font-bob-display)] text-[2.2rem] font-bold text-[#ffd400]">{price}</span>
      </div>

      <button
        type="button"
        onClick={onAction}
        disabled={status === 'locked' || status === 'owned'}
        className={cn(
          'mt-7 w-full rounded-[18px] border px-5 py-4 [font-family:var(--font-bob-display)] text-[1.35rem] font-bold',
          accent === 'green' && 'border-emerald-500/40 bg-emerald-500/18 text-emerald-400',
          accent === 'violet' && 'border-violet-500/40 bg-violet-500/16 text-violet-400',
          accent === 'amber' && 'border-[#ffd400]/40 bg-[#ffd400]/18 text-[#ffd400]',
          accent === 'gradient' && 'border-transparent bg-[linear-gradient(90deg,#18def0,#9138ff)] text-white shadow-[0_0_18px_rgba(30,231,255,0.25)]',
          status === 'locked' && 'cursor-not-allowed opacity-50',
          status === 'owned' && 'cursor-default opacity-80'
        )}
      >
        {actionLabel ?? 'Purchase'}
      </button>
    </div>
  );
}

function DemoVideoOverlay({
  demoVideoId,
  onClose,
}: {
  demoVideoId: string | null;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#05070d]/88 px-4 backdrop-blur-md">
      <div className="w-full max-w-[920px] rounded-[28px] border border-cyan-400/18 bg-[linear-gradient(180deg,#131723,#10131d)] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="[font-family:var(--font-bob-body)] text-sm uppercase tracking-[0.25em] text-cyan-300/80">
              Battle Of Brain
            </p>
            <h2 className="[font-family:var(--font-bob-display)] text-[1.8rem] font-bold text-white">
              Watch Demo
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

        {demoVideoId ? (
          <div className="overflow-hidden rounded-[22px] border border-white/8 bg-black">
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${demoVideoId}?autoplay=1&rel=0`}
                title="Battle Of Brain Demo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <div className="flex min-h-[260px] items-center justify-center rounded-[22px] border border-dashed border-white/12 bg-black/30 text-center">
            <div>
              <PauseCircle className="mx-auto h-10 w-10 text-white/35" />
              <p className="mt-3 [font-family:var(--font-bob-body)] text-[1rem] text-white/55">
                No demo video is attached yet. Add one from Admin Settings.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChartCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-[#171b24] px-5 py-5 sm:px-6 sm:py-6">
      <div className="mb-4 flex items-center gap-3">
        {icon}
        <h3 className="[font-family:var(--font-bob-display)] text-[2rem] font-bold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function PanelCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-[#171b24] px-5 py-5 sm:px-6 sm:py-6">
      <div className="mb-6 flex items-center gap-3">
        {icon}
        <h3 className="[font-family:var(--font-bob-display)] text-[2rem] font-bold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function LineAreaChart({
  points,
  color,
  fill,
  yLabels,
  xLabels,
}: {
  points: number[];
  color: string;
  fill: string;
  yLabels: string[];
  xLabels: string[];
}) {
  const width = 800;
  const height = 360;
  const padX = 36;
  const padY = 28;
  const chartWidth = width - padX * 2;
  const chartHeight = height - padY * 2;
  const max = Math.max(1, Math.max(...points) * 1.1);

  const coordinates = points.map((point, index) => {
    const x = padX + (index / Math.max(points.length - 1, 1)) * chartWidth;
    const y = height - padY - (point / max) * chartHeight;
    return [x, y] as const;
  });

  const linePath = coordinates
    .map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`)
    .join(' ');
  const areaPath = `${linePath} L ${coordinates[coordinates.length - 1][0]} ${height - padY} L ${coordinates[0][0]} ${height - padY} Z`;

  return (
    <div className="relative h-[300px] w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {yLabels.map((label, index) => {
          const ratio = index / Math.max(yLabels.length - 1, 1);
          const y = height - padY - ratio * chartHeight;
          return (
            <g key={label}>
              <line x1={padX} x2={width - padX} y1={y} y2={y} stroke="rgba(255,255,255,0.08)" />
              <text x={8} y={y + 4} fill="rgba(255,255,255,0.55)" fontSize="14" fontFamily="var(--font-bob-body)">
                {label}
              </text>
            </g>
          );
        })}

        {xLabels.map((label, index) => {
          const x = padX + (index / Math.max(xLabels.length - 1, 1)) * chartWidth;
          return (
            <g key={label}>
              <line x1={x} x2={x} y1={padY} y2={height - padY} stroke="rgba(255,255,255,0.05)" />
              <text
                x={x}
                y={height - 6}
                fill="rgba(255,255,255,0.55)"
                fontSize="14"
                textAnchor="middle"
                fontFamily="var(--font-bob-body)"
              >
                {label}
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill={fill} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="4" />
        {coordinates.map(([x, y], index) => (
          <circle key={`${x}-${y}-${index}`} cx={x} cy={y} r="6" fill={color} stroke="#10151f" strokeWidth="3" />
        ))}
      </svg>
    </div>
  );
}

function PieCard({
  subjectDistribution,
}: {
  subjectDistribution: Array<{ label: string; value: number; color: string }>;
}) {
  const total = subjectDistribution.reduce((sum, item) => sum + item.value, 0);
  let current = -90;

  const segments = subjectDistribution.map((item) => {
    const start = current;
    const end = current + (item.value / total) * 360;
    current = end;
    return { ...item, path: describeArc(50, 50, 34, start, end) };
  });

  return (
    <div className="grid items-center gap-6 lg:grid-cols-[1fr_0.7fr]">
      <div className="flex justify-center">
        <svg viewBox="0 0 100 100" className="h-[290px] w-[290px]">
          {segments.map((segment) => (
            <path key={segment.label} d={segment.path} fill={segment.color} />
          ))}
          <circle cx="50" cy="50" r="0.5" fill="#171b24" />
          {subjectDistribution.slice(0, 5).map((item, index) => (
            <g key={item.label}>
              <text
                x={[64, 34, 33, 56, 73][index]}
                y={[34, 34, 66, 79, 66][index]}
                fill="white"
                fontSize={index < 2 ? '5.8' : index === 2 ? '5.6' : '5.2'}
                fontWeight="700"
                textAnchor="middle"
              >
                {item.label}
              </text>
              <text
                x={[64, 34, 33, 56, 73][index]}
                y={[41, 41, 73, 86, 73][index]}
                fill="white"
                fontSize={index < 3 ? '5.2' : '4.8'}
                textAnchor="middle"
              >
                {item.value}%
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="space-y-3">
        {subjectDistribution.map((item) => (
          <div key={item.label} className="flex items-center gap-4">
            <span className="h-5 w-5 rounded-[2px]" style={{ backgroundColor: item.color }} />
            <span className="[font-family:var(--font-bob-body)] text-[1.35rem] text-white/55">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [`M ${cx} ${cy}`, `L ${start.x} ${start.y}`, `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`, 'Z'].join(' ');
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(radians),
    y: cy + r * Math.sin(radians),
  };
}

function PieIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 2v10l8.6 5A10 10 0 1 1 12 2Z" />
      <path d="M12 2a10 10 0 0 1 10 10h-10V2Z" />
    </svg>
  );
}

function getRecentDayLabels() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  });
}

function buildAxisLabels(maxValue: number, steps: number, compact = false) {
  const safeMax = Math.max(1, maxValue);
  return Array.from({ length: steps + 1 }, (_, index) => {
    const value = Math.round((safeMax / steps) * index);
    return compact && value >= 1000
      ? `${Number((value / 1000).toFixed(1)).toString()}k`
      : String(value);
  });
}

function extractYoutubeVideoId(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const match = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)?([A-Za-z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

function formatCompactNumber(value: number) {
  if (value <= 0) return '0';
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

function FlameIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.6 2.5c.3 2.1-.3 3.8-1.8 5.2-1.6 1.5-2.2 2.8-2.2 4.5 0 1.8 1.1 3.2 2.8 3.2 1.8 0 3.1-1.5 3.1-3.6 0-1.1-.2-1.9-1.1-3.1 2.8 1.3 4.6 4 4.6 7.1 0 4.2-2.9 7.2-6.8 7.2-4 0-7-2.9-7-7.1 0-4.9 3.2-7 5.5-9.8.9-1.1 1.8-2.4 2.9-3.6Z" />
    </svg>
  );
}

function CapIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M3 11.5c0-3.6 4.3-6.5 9.5-6.5S22 7.9 22 11.5c0 1.8-1 3.3-2.7 4.5-.2-1.6-1.8-2.9-3.8-2.9H11c-1.8 0-3.4 1.1-3.8 2.7C4.5 14.7 3 13.3 3 11.5Z" />
      <path d="M11 14h4.5c1.4 0 2.5 1.1 2.5 2.5V19h-7V14Z" />
    </svg>
  );
}

function CrownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M5 18h14l-1.5-9-4 3-2.5-5-2.5 5-4-3L5 18Z" />
    </svg>
  );
}
