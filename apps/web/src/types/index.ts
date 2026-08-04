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

// Payload for creating a class. Confirmed against RegisterClassDto via
// POST /class/register.
export interface CreateClassInput {
  name: string;
  habitat: string;
}

// Matches UpdateClassDto — both fields optional (partial update).
export interface UpdateClassInput {
  name?: string;
  habitat?: string;
}

// ClassController's register/update/delete endpoints all return this
// shape, not the class itself — refetch the list after calling them.
export interface MessageResponse {
  message: string;
}

// Mirrors RegisterStudentDto exactly. Used for POST /students/register.
export interface RegisterStudentInput {
  name: string;
  email: string;
  password: string;
  classId: string;
}

// This is what StudentsService.updateStudent's `updatedData` param
// actually looks like — no classId, every field optional. You pasted two
// different classes both named `RegisterStudentDto`; the second one
// (all @IsOptional(), no classId) is almost certainly this update DTO
// exported under the wrong name. Rename it on the backend to avoid two
// classes colliding under one identifier.
export interface UpdateStudentInput {
  name?: string;
  email?: string;
  password?: string;
}

// Row shape returned inside StudentsService.getAllStudentsFromUser's
// `students` array — no analytics here, this is roster data (name/email/
// isActive only), distinct from the `Student` type above used by the
// performance-analytics endpoints.
export interface RosterStudent {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

// One entry per class, as returned by GET /students
// (StudentsService.getAllStudentsFromUser) — every one of the teacher's
// classes, each with its currently-active students.
export interface ClassRoster {
  classId: string;
  className: string;
  students: RosterStudent[];
}