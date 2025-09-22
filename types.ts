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

export interface CelestialBody {
  id: string;
  title: string;
  subject: Subject;
  content: string; // Markdown or simple text content
  isCompleted: boolean;
  summary: string;
  description: string;
  bodyType: 'Star' | 'Terrestrial' | 'GasGiant' | 'IceGiant' | 'DwarfPlanet' | 'Moon';
  x: number;
  y: number;
  unlocks?: string;
  color?: string;
}

export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
}

export interface Rank {
  nameKey: string;
  minLevel: number;
  icon: React.ComponentType<{ className?: string }>;
}

export interface Quiz {
  id: string;
  question: string; // i18n key
  options: string[]; // array of i18n keys
  correctAnswer: string; // i18n key
}