// Shapes mirror your Prisma models (Students, Class, Quiz, QuizAttempt,
// StudentAnalytics). Fill these from your API response — none of the
// components below fetch data themselves.

export type QuizStatus = "done" | "current" | "locked";

export interface TrailQuiz {
  id: string; // Quiz.id
  title: string; // Quiz.title
  status: QuizStatus; // derived: has a QuizAttempt? next unattempted? else locked
  score?: number; // QuizAttempt.score (only when status === "done")
  totalItems?: number; // QuizAttempt.totalItems (only when status === "done")
}

export interface TrailClass {
  classId: string; // Class.id
  className: string; // Class.name
  habitat: string; // Class.habitat
  quizzes: TrailQuiz[];
}

export interface RecentAttempt {
  id: string; // QuizAttempt.id
  title: string; // Quiz.title (joined)
  score: number; // QuizAttempt.score
  totalItems: number; // QuizAttempt.totalItems
  durationSec: number; // QuizAttempt.durationSec
}

export interface StudentAnalyticsSummary {
  quizzesTaken: number;
  averageScore: number;
  highestScore: number;
  accuracy: number;
}

export interface ActiveQuizSession {
  sessionId: string; // live session / socket room id
  quizId: string;
  quizTitle: string;
  classId: string;
  startedAt: string; // ISO timestamp
}

export interface JoinQuizResponse {
  hasActiveQuiz: boolean;
  session?: ActiveQuizSession; // present only when hasActiveQuiz is true
}

export interface StudentDashboardData {
  studentName: string; // Students.name
  streakDays: number; // not in schema yet — derive from consecutive submittedAt days
  analytics: StudentAnalyticsSummary; // StudentAnalytics
  trail: TrailClass[];
  recentAttempts: RecentAttempt[];
}