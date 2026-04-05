'use client';

import { type ReactNode, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Compass,
  GraduationCap,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react';
import {
  CLASS10_BATCHES,
  CLASS12_RECOMMENDATIONS,
  CLASS12_SCORE_KEYS,
  STREAM_ORDER,
  STREAMS,
  buildClass10QuestionSet,
  buildClass12QuestionSet,
  type BatchRecommendation,
  type JourneyType,
  type QuizOption,
  type QuizQuestion,
  type StreamKey,
} from './data/pathways';

type AppStep = 'landing' | 'stream-picker' | 'quiz' | 'result';

function PageBg() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_32%),linear-gradient(180deg,#050111_0%,#09031a_100%)]" />
      <div className="absolute left-[-8rem] top-[-5rem] h-80 w-80 rounded-full bg-pink-500/10 blur-3xl" />
      <div className="absolute bottom-[-6rem] right-[-6rem] h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />
    </div>
  );
}

function GlassPanel({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}

function formatResults(scores: Record<string, number>, keys: string[]) {
  const ranked = keys
    .map((key) => ({ key, score: scores[key] || 0 }))
    .sort((a, b) => b.score - a.score);
  const total = ranked.reduce((sum, item) => sum + item.score, 0);
  const max = ranked[0]?.score || 0;

  return ranked.map((item) => ({
    ...item,
    percentage: total > 0 ? Math.round((item.score / total) * 100) : 0,
    barWidth: max > 0 ? Math.round((item.score / max) * 100) : 0,
  }));
}

function LandingView({ onSelectJourney }: { onSelectJourney: (journey: JourneyType) => void }) {
  const cards = [
    {
      journey: 'after10' as const,
      title: 'After Class 10th',
      subtitle: 'Choose the right stream',
      icon: BookOpen,
      accent: 'from-blue-500 via-indigo-500 to-violet-500',
    },
    {
      journey: 'after12' as const,
      title: 'After Class 12th',
      subtitle: 'Choose the right career direction',
      icon: GraduationCap,
      accent: 'from-pink-500 via-rose-500 to-orange-500',
    },
  ];

  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      className="relative z-10 mx-auto flex h-screen max-h-screen w-full max-w-7xl flex-col overflow-hidden px-4 py-4 md:px-7 md:py-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 text-lg">
            🎯
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white md:text-2xl">What&apos;s Next ?</h1>
            <p className="text-xs text-white/45 md:text-sm">Guidance for students after Class 10th and 12th</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200 md:flex">
          <Sparkles className="h-4 w-4" />
          Student guidance tool
        </div>
      </div>

      <div className="mx-auto flex max-w-5xl flex-1 flex-col items-center justify-center text-center">
        <div className="mb-3 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-white/65 md:text-xs">
          Choose the stage where you need guidance
        </div>
        <h2 className="max-w-4xl text-3xl font-black leading-[1.02] text-white md:text-5xl lg:text-6xl">
          Discover
          <span className="bg-gradient-to-r from-violet-300 via-pink-300 to-orange-200 bg-clip-text text-transparent">
            {' '}Your Next Move
          </span>
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55 md:text-[15px]">
          Pick one path below. We&apos;ll guide you through the right questions and recommend streams,
          careers, exams and batches accordingly.
        </p>

        <div className="mt-6 grid w-full max-w-5xl grid-cols-1 gap-3 md:grid-cols-2">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={card.journey}
                type="button"
                whileHover={{ y: -6, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelectJourney(card.journey)}
                className="text-left"
              >
                <GlassPanel className="group h-full p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] md:p-5">
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.accent} text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-3 text-xl font-black text-white md:text-2xl">{card.title}</h3>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.22em] text-white/35 md:text-xs">
                    {card.subtitle}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-200">
                    Continue
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </GlassPanel>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function StreamPickerView({ onPick, onBack }: { onPick: (stream: StreamKey) => void; onBack: () => void }) {
  return (
    <motion.div
      key="stream-picker"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      className="relative z-10 mx-auto flex min-h-[100svh] max-h-[100svh] w-full max-w-6xl flex-col justify-center overflow-hidden px-4 py-4 md:px-7 md:py-5"
    >
      <div className="mx-auto w-full max-w-4xl text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-200 md:text-sm">
          <Compass className="h-4 w-4" />
          After Class 12th Guidance
        </div>
        <h2 className="text-2xl font-black text-white md:text-4xl">
          Which stream did you choose
          <span className="bg-gradient-to-r from-rose-300 via-pink-300 to-orange-200 bg-clip-text text-transparent">
            {' '}
            after Class 10th?
          </span>
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-white/55 md:text-base">
          We&apos;ll ask questions according to your stream and then recommend the best career path, exams
          and relevant batches.
        </p>
      </div>

      <div className="mx-auto mt-4 grid w-full max-w-5xl grid-cols-1 gap-3 md:grid-cols-2">
        {STREAM_ORDER.map((stream) => (
          <motion.button
            key={stream}
            type="button"
            whileHover={{ y: -5, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onPick(stream)}
            className="text-left"
          >
            <GlassPanel className="h-full p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] md:p-5">
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${STREAMS[stream].gradient} text-xl`}>
                {STREAMS[stream].icon}
              </div>
              <h3 className="mt-3 text-lg font-black text-white md:text-xl">{STREAMS[stream].name}</h3>
            </GlassPanel>
          </motion.button>
        ))}
      </div>

      <div className="mt-4 text-center">
        <button type="button" onClick={onBack} className="text-sm font-medium text-white/40 transition-colors hover:text-white/70">
          Back to main selection
        </button>
      </div>
    </motion.div>
  );
}

function QuizView({
  title,
  subtitle,
  questions,
  currentIndex,
  selectedOption,
  onAnswer,
  onBack,
}: {
  title: string;
  subtitle: string;
  questions: QuizQuestion[];
  currentIndex: number;
  selectedOption: number | null;
  onAnswer: (option: QuizOption, optionIndex: number) => void;
  onBack: () => void;
}) {
  const question = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <motion.div
      key="quiz"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      className="relative z-10 mx-auto flex h-screen max-h-screen w-full max-w-5xl flex-col overflow-hidden px-4 py-3 md:px-6 md:py-3"
    >
      <div className="mb-2 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-white/55 md:text-sm">
            <Target className="h-4 w-4" />
            {title}
          </div>
          <h2 className="text-base font-black text-white md:text-xl">{subtitle}</h2>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold text-white/80 md:text-sm">
            {currentIndex + 1} / {questions.length}
          </div>
          <button type="button" onClick={onBack} className="mt-2 text-xs font-medium text-white/35 transition-colors hover:text-white/60">
            Start over
          </button>
        </div>
      </div>

      <div className="mb-2 h-2 overflow-hidden rounded-full bg-white/5">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-pink-500 to-orange-400" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
      </div>

      <div className="flex flex-1 items-center justify-center overflow-hidden">
        <GlassPanel className="flex h-full max-h-[calc(100svh-8rem)] w-full max-w-3xl flex-col justify-center p-3 md:max-h-[calc(100svh-8.5rem)] md:p-4">
          <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-xs font-black text-violet-200 md:h-9 md:w-9 md:text-sm">
            {currentIndex + 1}
          </div>
          <h3 className="text-[15px] font-black leading-snug text-white md:text-lg">{question.question}</h3>
          {question.subtitle ? <p className="mt-1 text-xs leading-relaxed text-white/50 md:text-sm">{question.subtitle}</p> : null}

          <div className="mt-3 grid grid-cols-1 gap-2 md:mt-4">
            {question.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isLocked = selectedOption !== null;

              return (
                <motion.button
                  key={`${question.id}-${index}`}
                  type="button"
                  whileHover={isLocked ? undefined : { scale: 1.01 }}
                  whileTap={isLocked ? undefined : { scale: 0.99 }}
                  disabled={isLocked}
                  onClick={() => onAnswer(option, index)}
                  className="flex w-full items-center gap-3 rounded-2xl border px-3 py-2 text-left transition-all duration-300 md:px-4 md:py-2.5"
                  style={{
                    borderColor: isSelected ? 'rgba(167,139,250,0.7)' : 'rgba(255,255,255,0.08)',
                    background: isSelected ? 'rgba(139,92,246,0.18)' : 'rgba(255,255,255,0.03)',
                    opacity: isLocked && !isSelected ? 0.45 : 1,
                  }}
                >
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold md:h-8 md:w-8 md:text-sm"
                    style={{ background: isSelected ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : 'rgba(255,255,255,0.05)', color: '#fff' }}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-sm font-medium leading-snug text-white/90 md:text-sm">{option.text}</span>
                </motion.button>
              );
            })}
          </div>
        </GlassPanel>
      </div>
    </motion.div>
  );
}

function BatchCards({ batches }: { batches: BatchRecommendation[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {batches.map((batch) => (
        <a key={`${batch.label}-${batch.batchName}`} href={batch.link} target="_blank" rel="noreferrer" className="block">
          <GlassPanel className="h-full p-5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">{batch.label}</p>
            <h4 className="mt-3 text-lg font-bold text-white">{batch.batchName}</h4>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-200">
              Open Batch
              <ArrowRight className="h-4 w-4" />
            </p>
          </GlassPanel>
        </a>
      ))}
    </div>
  );
}

function ResultsBarList({ items, render }: { items: ReturnType<typeof formatResults>; render: (key: string) => { label: string; icon: string; gradient: string } }) {
  return (
    <div className="space-y-4">
      {items.map((item) => {
        const info = render(item.key);
        return (
          <div key={item.key}>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{info.icon}</span>
                <span className="font-semibold text-white/85">{info.label}</span>
              </div>
              <span className="font-bold text-white/75">{item.percentage}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/5">
              <div className={`h-full rounded-full bg-gradient-to-r ${info.gradient}`} style={{ width: `${item.barWidth}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Class10ResultView({ scores, onRestart }: { scores: Record<string, number>; onRestart: () => void }) {
  const results = useMemo(() => formatResults(scores, STREAM_ORDER), [scores]);
  const winner = STREAMS[results[0].key as StreamKey];
  const runnerUp = results[1] ? STREAMS[results[1].key as StreamKey] : null;

  return (
    <motion.div key="result-after10" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="relative z-10 mx-auto min-h-screen w-full max-w-6xl px-6 py-10 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-200">
            <Trophy className="h-4 w-4" />
            After Class 10th Result
          </div>
          <h2 className="text-4xl font-black text-white md:text-6xl">
            Recommended Stream:
            <span className="bg-gradient-to-r from-violet-300 via-pink-300 to-orange-200 bg-clip-text text-transparent"> {winner.name}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-white/55">{winner.description}</p>
        </div>

        <GlassPanel className="mt-10 p-8 md:p-10">
          <div className="flex flex-col items-center text-center">
            <div className={`flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br ${winner.gradient} text-5xl`}>
              {winner.icon}
            </div>
            <h3 className="mt-6 text-3xl font-black text-white">{winner.fullName}</h3>
            <p className="mt-2 text-white/40">Best fit based on your 15-answer profile</p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-violet-300" />
                <h4 className="text-lg font-bold text-white">Possible Career Directions</h4>
              </div>
              <div className="space-y-3">{winner.careers.map((career) => <div key={career} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-white/80">{career}</div>)}</div>
            </div>
            <div>
              <div className="mb-4 flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-pink-300" />
                <h4 className="text-lg font-bold text-white">Recommended Subjects</h4>
              </div>
              <div className="space-y-3">{winner.subjects.map((subject) => <div key={subject} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-white/80">{subject}</div>)}</div>
            </div>
          </div>

          {runnerUp ? (
            <div className="mt-8 rounded-3xl border border-white/8 bg-white/[0.02] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/30">Runner Up</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-3xl">{runnerUp.icon}</span>
                <div>
                  <p className="text-lg font-bold text-white">{runnerUp.name}</p>
                  <p className="text-sm text-white/45">{runnerUp.fullName}</p>
                </div>
              </div>
            </div>
          ) : null}
        </GlassPanel>

        <div className="mt-10">
          <div className="mb-5 flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-emerald-300" />
            <h3 className="text-2xl font-black text-white">Recommended Batches</h3>
          </div>
          <BatchCards batches={CLASS10_BATCHES[winner.key]} />
        </div>

        <div className="mt-10 rounded-[28px] border border-white/8 bg-white/[0.03] p-6">
          <h3 className="mb-5 text-xl font-black text-white">Stream Match Breakdown</h3>
          <ResultsBarList items={results} render={(key) => ({ label: STREAMS[key as StreamKey].name, icon: STREAMS[key as StreamKey].icon, gradient: STREAMS[key as StreamKey].gradient })} />
        </div>

        <div className="mt-10 text-center">
          <button type="button" onClick={onRestart} className="inline-flex items-center gap-3 rounded-2xl border border-violet-400/20 bg-violet-500/10 px-7 py-4 font-semibold text-white transition-all hover:bg-violet-500/15">
            <RotateCcw className="h-5 w-5" />
            Start Again
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Class12ResultView({ scores, selectedStream, onRestart }: { scores: Record<string, number>; selectedStream: StreamKey; onRestart: () => void }) {
  const keys = Object.keys(scores);
  const results = useMemo(() => formatResults(scores, keys), [keys, scores]);
  const winner = CLASS12_RECOMMENDATIONS[results[0].key];

  return (
    <motion.div key="result-after12" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="relative z-10 mx-auto min-h-screen w-full max-w-6xl px-6 py-10 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
            <Trophy className="h-4 w-4" />
            After Class 12th Result for {STREAMS[selectedStream].name}
          </div>
          <h2 className="text-4xl font-black text-white md:text-6xl">
            Recommended Path:
            <span className="bg-gradient-to-r from-rose-300 via-pink-300 to-orange-200 bg-clip-text text-transparent"> {winner.title}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-white/55">{winner.summary}</p>
        </div>

        <GlassPanel className="mt-10 p-8 md:p-10">
          <div className="flex flex-col items-center text-center">
            <div className={`flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br ${winner.gradient} text-5xl`}>
              {winner.icon}
            </div>
            <h3 className="mt-6 text-3xl font-black text-white">{winner.title}</h3>
            <p className="mt-2 text-white/40">{winner.subtitle}</p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-violet-300" />
                <h4 className="text-lg font-bold text-white">Career Paths You Can Explore</h4>
              </div>
              <div className="space-y-3">{winner.careers.map((career) => <div key={career} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-white/80">{career}</div>)}</div>
            </div>
            <div>
              <div className="mb-4 flex items-center gap-3">
                <Target className="h-5 w-5 text-pink-300" />
                <h4 className="text-lg font-bold text-white">Exams You Can Give</h4>
              </div>
              <div className="space-y-3">{winner.exams.map((exam) => <div key={exam} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-white/80">{exam}</div>)}</div>
            </div>
          </div>
        </GlassPanel>

        <div className="mt-10">
          <div className="mb-5 flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-emerald-300" />
            <h3 className="text-2xl font-black text-white">Recommended Batches</h3>
          </div>
          <BatchCards batches={winner.batches} />
        </div>

        <div className="mt-10 rounded-[28px] border border-white/8 bg-white/[0.03] p-6">
          <h3 className="mb-5 text-xl font-black text-white">Path Match Breakdown</h3>
          <ResultsBarList items={results} render={(key) => ({ label: CLASS12_RECOMMENDATIONS[key].title, icon: CLASS12_RECOMMENDATIONS[key].icon, gradient: CLASS12_RECOMMENDATIONS[key].gradient })} />
        </div>

        <div className="mt-10 text-center">
          <button type="button" onClick={onRestart} className="inline-flex items-center gap-3 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-7 py-4 font-semibold text-white transition-all hover:bg-rose-500/15">
            <RotateCcw className="h-5 w-5" />
            Start Again
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function StreamPredictorPage() {
  const [step, setStep] = useState<AppStep>('landing');
  const [journey, setJourney] = useState<JourneyType | null>(null);
  const [selectedStream, setSelectedStream] = useState<StreamKey | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});

  const resetAll = () => {
    setJourney(null);
    setSelectedStream(null);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScores({});
    setStep('landing');
  };

  const handleJourneySelect = (nextJourney: JourneyType) => {
    if (nextJourney === 'after10') {
      const sampledQuestions = buildClass10QuestionSet();
      setJourney('after10');
      setSelectedStream(null);
      setQuestions(sampledQuestions);
      setCurrentIndex(0);
      setSelectedOption(null);
      setScores({ pcm: 0, pcb: 0, commerce: 0, humanities: 0 });
      setStep('quiz');
      return;
    }

    setJourney('after12');
    setSelectedStream(null);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScores({});
    setStep('stream-picker');
  };

  const handleStreamPick = (stream: StreamKey) => {
    const selectedQuestions = buildClass12QuestionSet(stream);
    const initialScores = CLASS12_SCORE_KEYS[stream].reduce<Record<string, number>>((acc, key) => {
        acc[key] = 0;
        return acc;
      }, {});

    setJourney('after12');
    setSelectedStream(stream);
    setQuestions(selectedQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScores(initialScores);
    setStep('quiz');
  };

  const handleAnswer = (option: QuizOption, optionIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);

    window.setTimeout(() => {
      setScores((prev) => {
        const next = { ...prev };
        for (const [key, value] of Object.entries(option.scores)) {
          next[key] = (next[key] || 0) + value;
        }
        return next;
      });

      if (currentIndex === questions.length - 1) {
        setStep('result');
      } else {
        setCurrentIndex((value) => value + 1);
      }

      setSelectedOption(null);
    }, 280);
  };

  const quizTitle =
    journey === 'after10'
      ? 'After Class 10th Stream Predictor'
      : `After Class 12th Career Guidance${selectedStream ? ` · ${STREAMS[selectedStream].name}` : ''}`;

  return (
    <div className={`${step === 'landing' ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-[#050111]`}>
      <PageBg />
      <AnimatePresence mode="wait">
        {step === 'landing' ? <LandingView key="landing" onSelectJourney={handleJourneySelect} /> : null}
        {step === 'stream-picker' ? <StreamPickerView key="stream-picker" onPick={handleStreamPick} onBack={resetAll} /> : null}
        {step === 'quiz' ? (
          <QuizView
            key="quiz"
            title={quizTitle}
            subtitle={
              journey === 'after10'
                ? 'Answer 15 questions and discover the stream that fits you best'
                : 'Answer stream-specific questions and get your next-step recommendation'
            }
            questions={questions}
            currentIndex={currentIndex}
            selectedOption={selectedOption}
            onAnswer={handleAnswer}
            onBack={resetAll}
          />
        ) : null}
        {step === 'result' && journey === 'after10' ? <Class10ResultView key="result-after10" scores={scores} onRestart={resetAll} /> : null}
        {step === 'result' && journey === 'after12' && selectedStream ? (
          <Class12ResultView key="result-after12" scores={scores} selectedStream={selectedStream} onRestart={resetAll} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
