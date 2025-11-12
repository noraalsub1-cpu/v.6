import type { ReactNode } from 'react';

export interface Lesson {
  id: string;
  name: string;
  content: string;
  completed: boolean;
  academicStage: string;
  semester: string;
  unit: string;
  featureUsage?: {
    summary: boolean;
    solutions: boolean;
    flashcards: boolean;
    quiz: boolean;
    chat: boolean;
  };
}

export interface StudyMaterial {
  id: string;
  name: string;
  type: 'pdf' | 'youtube' | 'powerpoint' | 'word';
  lessons: Lesson[];
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface QuizQuestion {
  id:string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options: string[];
  correctAnswer: string;
  explanation?: string;
  sourceLesson?: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface GlossaryTerm {
    id: string;
    term: string;
    definition: string;
}

export interface SuggestedSource {
    id: string;
    title: string;
    url: string;
    type: 'article' | 'video' | 'book';
}

export interface User {
    name: string;
    email: string;
    plan: 'الخطة المجانية' | 'الخطة الاحترافية' | 'الخطة المؤسسية';
}

export interface Task {
  id: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  completed: boolean;
  notes: string;
  category: 'study' | 'stdTest';
}

export interface QuizAnalysis {
    main_topics_of_weakness: string[];
}

export interface LessonSolution {
    id: string;
    question: string;
    solution: string;
}


export type View = 'dashboard' | 'upload' | 'material' | 'introduction' | 'admin' | 'login' | 'signup' | 'materials' | 'settings' | 'standardizedTest' | 'standardizedTestLanding';

export type AdminDetailsViewType = 'totalUsers' | 'monthlyRevenue' | 'supportTickets' | 'systemHealth' | 'contentModeration';
export type DetailsViewType = 'studyTime' | 'flashcards' | 'quizAverage' | 'nextSteps' | 'privacyPolicy' | 'termsAndConditions' | 'standardizedTestPerformance' | AdminDetailsViewType;

export type StandardizedTestSubject =
  | 'qudrat-verbal'
  | 'qudrat-quantitative'
  | 'tahseeli-math'
  | 'tahseeli-physics'
  | 'tahseeli-chemistry'
  | 'tahseeli-biology';

export type StandardizedTestScores = Partial<Record<StandardizedTestSubject, { correct: number; incorrect: number; }>>;