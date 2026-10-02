export interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string; // e.g. "Kháng chiến chống Pháp", "Kháng chiến chống Mỹ", "Lịch sử Thế giới", "Việt Nam Cổ - Trung đại"
  difficulty?: 'Dễ' | 'Trung bình' | 'Khó';
  period?: string;
  isCustom?: boolean;
}

export type QuizModeType = 'practice' | 'exam' | 'flashcard';

export interface UserAnswer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  timeSpentSeconds?: number;
}

export interface QuizRecord {
  id?: string;
  date: string;
  score: number;
  total: number;
  percentage: number;
  mode?: string;
  category?: string;
}

export interface Topic {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  isDefault?: boolean;
}

export interface QuizFilter {
  category: string;
  questionCount: number; // 5, 10, 20, or 0 (all)
  difficulty: string; // 'Tất cả' | 'Dễ' | 'Trung bình' | 'Khó'
}
