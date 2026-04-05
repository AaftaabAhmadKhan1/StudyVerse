import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { usePractice } from '@/hooks/usePractice';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { CoinDisplay } from '@/components/CoinDisplay';
import { Diamond, Clock, CheckCircle2, XCircle, Loader2, Dumbbell, ArrowLeft } from 'lucide-react';

const QUESTION_TIME = 60;

export default function PracticeBattlePage() {
  const navigate = useNavigate();
  const { user, profile, refreshStats, isGuest, userStats, updateProfile } = useAuth();
  const { questions, loading, error, startPractice } = usePractice();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [answers, setAnswers] = useState<{ correct: boolean; time: number }[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const question = questions[currentIndex];

  const handleSubmit = useCallback(async (option: number | null = selectedOption) => {
    if (isAnswered || !question || !user) return;

    const timeSpent = QUESTION_TIME - timeLeft;
    const isCorrect = option === question.correct_answer;
    const coinReward = isCorrect && question.is_diamond ? 5 : 0;

    setIsAnswered(true);
    setShowResult(true);
    if (isCorrect) setScore(prev => prev + 100);
    if (coinReward > 0) setCoinsEarned(prev => prev + coinReward);
    
    const newAnswer = { correct: isCorrect, time: timeSpent };
    setAnswers(prev => [...prev, newAnswer]);

    if (!isGuest) {
      await supabase.from('user_answers').insert({
        user_id: user.id,
        question_id: question.id,
        is_practice: true,
        selected_answer: option,
        is_correct: isCorrect,
        time_spent: timeSpent,
        coins_earned: coinReward,
      });
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
        setShowResult(false);
        setTimeLeft(QUESTION_TIME);
      } else {
        setQuizComplete(true);
        // Pass all answers including this last one directly
        finishPractice([...answers, newAnswer]);
      }
    }, 2000);
  }, [selectedOption, isAnswered, question, timeLeft, user, currentIndex, questions.length, answers]);

  const finishPractice = async (allAnswers: { correct: boolean; time: number }[]) => {
    if (!user) return;
    const correctCount = allAnswers.filter(a => a.correct).length;

    if (isGuest && userStats) {
      const fast5 = allAnswers.filter(a => a.time <= 5).length;
      const fast10 = allAnswers.filter(a => a.time <= 10).length;
      const fast30 = allAnswers.filter(a => a.time <= 30).length;
      localStorage.setItem('bob-guest-stats', JSON.stringify({
        ...userStats,
        practice_questions: userStats.practice_questions + questions.length,
        practice_correct: userStats.practice_correct + correctCount,
        total_questions: userStats.total_questions + questions.length,
        correct_answers: userStats.correct_answers + correctCount,
        wrong_answers: userStats.wrong_answers + (questions.length - correctCount),
        answered_in_5sec: userStats.answered_in_5sec + fast5,
        answered_in_10sec: userStats.answered_in_10sec + fast10,
        answered_in_30sec: userStats.answered_in_30sec + fast30,
        updated_at: new Date().toISOString(),
      }));
      if (coinsEarned > 0) {
        await updateProfile({ total_coins: (profile?.total_coins || 0) + coinsEarned });
      }
      await refreshStats();
      return;
    }
    
    const { data: stats } = await supabase.from('user_stats').select('*').eq('user_id', user.id).single();
    if (stats) {
      const fast5 = allAnswers.filter(a => a.time <= 5).length;
      const fast10 = allAnswers.filter(a => a.time <= 10).length;
      const fast30 = allAnswers.filter(a => a.time <= 30).length;
      
      await supabase.from('user_stats').update({
        practice_questions: stats.practice_questions + questions.length,
        practice_correct: stats.practice_correct + correctCount,
        total_questions: stats.total_questions + questions.length,
        correct_answers: stats.correct_answers + correctCount,
        wrong_answers: stats.wrong_answers + (questions.length - correctCount),
        answered_in_5sec: stats.answered_in_5sec + fast5,
        answered_in_10sec: stats.answered_in_10sec + fast10,
        answered_in_30sec: stats.answered_in_30sec + fast30,
      }).eq('user_id', user.id);
    }
    if (coinsEarned > 0) {
      await supabase.from('profiles').update({
        total_coins: (profile?.total_coins || 0) + coinsEarned,
      }).eq('user_id', user.id);
    }
    await refreshStats();
  };

  useEffect(() => {
    if (!quizStarted || isAnswered || quizComplete) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { handleSubmit(null); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizStarted, isAnswered, quizComplete, handleSubmit]);

  // Pre-start screen
  if (!quizStarted || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full space-y-8 animate-fade-in text-center">
          <Button variant="ghost" onClick={() => navigate('/')} className="absolute top-4 left-4 gap-2">
            <ArrowLeft size={20} /> Back
          </Button>
          
          <Dumbbell className="mx-auto text-primary" size={64} />
          <h1 className="font-display text-3xl font-bold">Practice Mode</h1>
          <p className="font-body text-muted-foreground">
            Same rules as Live Battle • No leaderboard • Personal score only
          </p>
          <div className="card-gaming p-4">
            <p className="font-body text-sm text-muted-foreground">
              {profile?.board} • Class {profile?.class_level} • AI-Generated Questions
            </p>
          </div>

          {questions.length > 0 ? (
            <Button onClick={() => setQuizStarted(true)} className="btn-gaming w-full py-6 text-lg">
              START PRACTICE 🎯
            </Button>
          ) : (
            <Button onClick={startPractice} disabled={loading} className="btn-gaming w-full py-6 text-lg">
              {loading ? <Loader2 className="animate-spin" /> : 'GENERATE QUESTIONS'}
            </Button>
          )}
          {error && <p className="text-destructive font-body text-sm">{error}</p>}
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const correctCount = answers.filter(a => a.correct).length;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full space-y-6 animate-fade-in text-center">
          <CheckCircle2 className="mx-auto text-success" size={64} />
          <h1 className="font-display text-3xl font-bold">Practice Complete!</h1>
          <div className="card-gaming p-6">
            <p className="font-display text-4xl font-black text-gradient-gold">{score}</p>
            <p className="font-body text-muted-foreground">Points</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="card-gaming p-4">
              <p className="font-display font-bold text-xl text-success">{correctCount}</p>
              <p className="font-body text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="card-gaming p-4">
              <p className="font-display font-bold text-xl text-destructive">{questions.length - correctCount}</p>
              <p className="font-body text-xs text-muted-foreground">Wrong</p>
            </div>
          </div>
          {coinsEarned > 0 && <CoinDisplay amount={coinsEarned} size="lg" animate showLabel />}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>Home</Button>
            <Button onClick={() => { setQuizComplete(false); setQuizStarted(false); setCurrentIndex(0); setScore(0); setCoinsEarned(0); setAnswers([]); }} className="btn-gaming">
              Play Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!question) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>;

  const timerPct = (timeLeft / QUESTION_TIME) * 100;
  const isCorrect = question.correct_answer === selectedOption;
  const options = question.options as string[];

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-lg">Q{currentIndex + 1}/{questions.length}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-display uppercase ${
            question.difficulty === 'easy' ? 'bg-success/20 text-success' :
            question.difficulty === 'medium' ? 'bg-accent/20 text-accent' : 'bg-destructive/20 text-destructive'
          }`}>{question.difficulty}</span>
          {question.is_diamond && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-diamond/20 text-diamond">
              <Diamond size={14} /><span className="text-xs font-display">+5</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Clock size={20} className={timeLeft <= 10 ? 'text-destructive animate-pulse' : 'text-muted-foreground'} />
          <span className={`font-display font-bold text-xl tabular-nums ${timeLeft <= 10 ? 'text-destructive' : ''}`}>{timeLeft}s</span>
        </div>
      </div>

      <div className="question-timer mb-8">
        <div className="question-timer-fill" style={{ width: `${timerPct}%`, backgroundColor: timerPct > 50 ? 'hsl(145 70% 45%)' : timerPct > 20 ? 'hsl(45 100% 55%)' : 'hsl(0 85% 55%)' }} />
      </div>

      <div className={`card-gaming p-6 md:p-8 mb-6 flex-1 ${question.is_diamond ? 'diamond-question' : ''}`}>
        <p className="font-body text-sm text-muted-foreground mb-4">{question.subject}</p>
        <h2 className="font-body text-xl md:text-2xl font-semibold mb-8 leading-relaxed">{question.question_text}</h2>
        <div className="grid gap-4">
          {options.map((opt, i) => {
            let cls = 'card-gaming p-4 md:p-5 cursor-pointer transition-all duration-300 border-2';
            if (showResult) {
              if (i === question.correct_answer) cls += ' border-success bg-success/20';
              else if (i === selectedOption && !isCorrect) cls += ' border-destructive bg-destructive/20';
              else cls += ' border-border opacity-50';
            } else if (selectedOption === i) cls += ' border-primary glow-primary';
            else cls += ' border-border hover:border-primary/50';

            return (
              <button key={i} onClick={() => !isAnswered && setSelectedOption(i)} disabled={isAnswered} className={cls}>
                <div className="flex items-center gap-4">
                  <span className={`w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold ${
                    showResult && i === question.correct_answer ? 'bg-success text-success-foreground' :
                    showResult && i === selectedOption && !isCorrect ? 'bg-destructive text-destructive-foreground' :
                    selectedOption === i ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>{String.fromCharCode(65 + i)}</span>
                  <span className="font-body text-lg flex-1 text-left">{opt}</span>
                  {showResult && i === question.correct_answer && <CheckCircle2 className="text-success" size={24} />}
                  {showResult && i === selectedOption && !isCorrect && <XCircle className="text-destructive" size={24} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {!isAnswered && (
        <Button onClick={() => handleSubmit()} disabled={selectedOption === null} className="btn-gaming py-6 text-lg rounded-xl disabled:opacity-50">
          SUBMIT ANSWER
        </Button>
      )}

      {showResult && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className={`card-gaming p-8 text-center ${isCorrect ? 'glow-primary' : ''}`}>
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-20 h-20 text-success mx-auto mb-4" />
                <h3 className="font-display text-2xl font-bold text-success mb-2">Correct!</h3>
                <p className="font-body text-muted-foreground">+100 points</p>
                {question.is_diamond && <div className="mt-4"><CoinDisplay amount={5} size="lg" animate showLabel /></div>}
              </>
            ) : (
              <>
                <XCircle className="w-20 h-20 text-destructive mx-auto mb-4" />
                <h3 className="font-display text-2xl font-bold text-destructive mb-2">{selectedOption === null ? "Time's Up!" : 'Wrong!'}</h3>
                <p className="font-body text-muted-foreground">Correct: {options[question.correct_answer]}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
