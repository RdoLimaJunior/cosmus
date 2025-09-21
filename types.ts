export enum Subject {
  Biology = 'Biology',
  Chemistry = 'Chemistry',
  Physics = 'Physics',
}

export interface PracticeQuestion {
  id: string;
  subject: Subject;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface BadgeCriteria {
  streak?: number;
  correctAnswers?: number;
  scorePercentage?: number;
  minQuestions?: number;
  modulesCompleted?: number;
}

export interface Badge {
  id:string;
  title: string;
  description: string;
  type: 'practice' | 'study';
  criteria: BadgeCriteria;
}

export interface PerformanceData {
  date: string; // e.g., "2023-10-01"
  subject: Subject;
  score: number; // Percentage
}

export interface StudyModule {
  id: string;
  title: string;
  subject: Subject;
  content: string; // Markdown or simple text content
  isCompleted: boolean;
  summary: string;
  x: number;
  y: number;
  unlocks?: string;
}

export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
}