import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Board, ClassLevel, Question, UserAnswer, UserStats, SeasonLevel } from '@/types/game';
import { getQuizQuestions, mockUserStats } from '@/data/mockData';

interface GameState {
  // Selection
  selectedBoard: Board | null;
  selectedClass: ClassLevel | null;
  username: string;
  
  // Quiz state
  currentQuestionIndex: number;
  questions: Question[];
  answers: UserAnswer[];
  isQuizActive: boolean;
  isQuizComplete: boolean;
  
  // User stats
  userStats: UserStats;
  coins: number;
  
  // Time
  quizStartTime: Date | null;
}

interface GameContextType extends GameState {
  setSelection: (board: Board, classLevel: ClassLevel, username: string) => void;
  startQuiz: () => void;
  submitAnswer: (questionId: string, selectedAnswer: number, timeSpent: number) => void;
  nextQuestion: () => void;
  completeQuiz: () => void;
  resetGame: () => void;
  getCurrentQuestion: () => Question | null;
  getScore: () => number;
  getCoinsEarned: () => number;
}

const initialState: GameState = {
  selectedBoard: null,
  selectedClass: null,
  username: '',
  currentQuestionIndex: 0,
  questions: [],
  answers: [],
  isQuizActive: false,
  isQuizComplete: false,
  userStats: mockUserStats,
  coins: mockUserStats.totalCoins,
  quizStartTime: null,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);

  const setSelection = (board: Board, classLevel: ClassLevel, username: string) => {
    setState(prev => ({
      ...prev,
      selectedBoard: board,
      selectedClass: classLevel,
      username,
    }));
  };

  const startQuiz = () => {
    if (!state.selectedBoard || !state.selectedClass) return;
    
    const filteredQuestions = getQuizQuestions(state.selectedBoard, state.selectedClass);
    
    setState(prev => ({
      ...prev,
      questions: filteredQuestions,
      isQuizActive: true,
      currentQuestionIndex: 0,
      answers: [],
      quizStartTime: new Date(),
    }));
  };

  const submitAnswer = (questionId: string, selectedAnswer: number, timeSpent: number) => {
    const question = state.questions.find(q => q.id === questionId);
    if (!question) return;

    const isCorrect = question.correctAnswer === selectedAnswer;
    const answer: UserAnswer = {
      questionId,
      selectedAnswer,
      isCorrect,
      timeSpent,
    };

    setState(prev => ({
      ...prev,
      answers: [...prev.answers, answer],
    }));
  };

  const nextQuestion = () => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1,
    }));
  };

  const completeQuiz = () => {
    setState(prev => ({
      ...prev,
      isQuizActive: false,
      isQuizComplete: true,
    }));
  };

  const resetGame = () => {
    setState(initialState);
  };

  const getCurrentQuestion = (): Question | null => {
    if (state.currentQuestionIndex >= state.questions.length) return null;
    return state.questions[state.currentQuestionIndex];
  };

  const getScore = (): number => {
    return state.answers.filter(a => a.isCorrect).length * 100;
  };

  const getCoinsEarned = (): number => {
    let coins = 0;
    state.answers.forEach((answer, index) => {
      if (answer.isCorrect && state.questions[index]?.isDiamond) {
        coins += 5;
      }
    });
    return coins;
  };

  return (
    <GameContext.Provider
      value={{
        ...state,
        setSelection,
        startQuiz,
        submitAnswer,
        nextQuestion,
        completeQuiz,
        resetGame,
        getCurrentQuestion,
        getScore,
        getCoinsEarned,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
