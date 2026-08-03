export type Accent = "leaf" | "sky" | "gold" | "ember" | "bark";

export type NavKey = "dashboard" | "classes" | "analytics" | "settings";

export interface Teacher {
  name: string;
}

// Mirrors the Prisma `ClassAnalytics` model
export interface ClassAnalytics {
  totalStudents: number;
  quizzesCreated: number;
  quizzesCompleted: number;
  averageScore: number;
}

// Mirrors the Prisma `Class` model (fields the dashboard actually needs)
export interface ClassItem {
  id: string;
  name: string;
  habitat: string;
  isActive: boolean;
  classAnalytics?: ClassAnalytics | null;
}

// Mirrors the Prisma `StudentAnalytics` model
export interface StudentAnalytics {
  quizzesTaken: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  totalTimeSpent: number;
  accuracy: number;
}

// Mirrors the Prisma `Students` model. There's no `status` field on the
// backend — status is derived client-side from `analytics.averageScore`
// (see lib/studentStatus.ts).
export interface Student {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  classroomId: string;
  // Not on the Prisma model directly — hydrate via a join/include on the
  // backend if a cross-class view needs to show which class a row is from.
  className?: string;
  analytics?: StudentAnalytics | null;
}

export type StudentStatus = "on-track" | "watch" | "needs-attention";

// There's no time-series model in the schema (no per-day rollup table).
// The backend needs to aggregate QuizAttempt.submittedAt into buckets
// (e.g. group by day/week, avg(score)) to produce this.
export interface TrendPoint {
  label: string;
  avgScore: number;
}

export interface StatItem {
  label: string;
  value: string;
  accent?: Accent;
}