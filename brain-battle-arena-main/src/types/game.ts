export type Board = 'CBSE' | 'ICSE';
export type ClassLevel = '9th' | '10th' | '11th' | '12th';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: Difficulty;
  isDiamond: boolean;
  subject: string;
  class: ClassLevel;
  board: Board;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: number | null;
  isCorrect: boolean;
  timeSpent: number; // in seconds
}

export interface GameSession {
  id: string;
  userId: string;
  class: ClassLevel;
  board: Board;
  date: string;
  answers: UserAnswer[];
  score: number;
  rank: number;
  coinsEarned: number;
}

export type SeasonLevel = 
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'diamond'
  | 'master'
  | 'conquer'
  | 'survivor';

export interface UserStats {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  answeredIn5Sec: number;
  answeredIn10Sec: number;
  answeredIn30Sec: number;
  gamesWon: number;
  top5Finishes: number;
  top10Finishes: number;
  currentLevel: SeasonLevel;
  currentTier: 1 | 2 | 3;
  totalCoins: number;
  questionsToNextTier: number;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  unlocked: boolean;
}

export interface Player {
  id: string;
  username: string;
  avatar: string;
  score: number;
  rank: number;
  level: SeasonLevel;
  tier: 1 | 2 | 3;
}
