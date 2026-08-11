
import type {
  TeacherResponse,
  ClassItemResponse,
  StudentPerformanceResponse,
  TrendPointResponse,
} from "@repo/types";

// ─── Backend-derived aliases (what the UI actually consumes) ──────
export type Teacher = TeacherResponse;
export type ClassItem = ClassItemResponse;
export type Student = StudentPerformanceResponse;
export type TrendPoint = TrendPointResponse;

// ─── UI-only types (no backend equivalent) ─────────────────────────
export type NavKey =
  | "dashboard"
  | "classes"
  | "students"
  | "quizzes"
  | "analytics"
  | "settings";

export type Accent =
  | "leaf"
  | "sky"
  | "gold"
  | "ember"
  | "bark"
  | "grape"
  | "bubblegum";

export interface StatItem {
  label: string;
  value: string;
  accent?: Accent;
}

export interface loginForm{
  email: string;
  password: string;
}
// Mirrors the Prisma `ClassAnalytics` model
export interface ClassAnalytics {
  totalStudents: number;
  quizzesCreated: number;
  quizzesCompleted: number;
  averageScore: number;
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


export type StudentStatus = "on-track" | "watch" | "needs-attention";

// There's no time-series model in the schema (no per-day rollup table).
// The backend needs to aggregate QuizAttempt.submittedAt into buckets
// (e.g. group by day/week, avg(score)) to produce this.

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

// Confirmed request shape from StartQuizDto (POST .../game/create).
export interface StartSessionInput {
  classId: string;
}

// Confirmed against GameService.CreateQuizSession's cache write: the
// session has no `id` and no join code — it's identified purely by
// `classId`, which is also the cache key. `students` is the class's full
// registered roster at creation time, each starting with isInGame: false;
// sockets are presumably what flips that flag as students connect (event
// contract still unconfirmed — see useLiveQuizSession.ts).
export interface SessionStudent {
  id: string;
  name: string;
  isInGame: boolean;
}

export interface QuizSessiondata {
  classId: string;
  students: SessionStudent[];
  createdAt: string;
  status: string; // only "active" observed in the service so far
  isStarted: boolean;
}

// Mirrors the Prisma `UploadedFile` model (list-view fields only —
// `questions`/`pptUrl` are omitted here since the lobby just needs
// enough to display and select a file, not render its contents).
export interface UploadedFileSummary {
  id: string;
  classId: string;
  fileName: string;
  summary?: string | null;
  createdAt: string;
}

// Mirrors GenerateQuestionsDto / GenerateQuestionsRequest from
// @repo/types exactly.
export type QuestionType = "multiple-choice" | "true-false" | "short-answer";

export interface GenerateQuestionsInput {
  content?: string | null;
  numberOfQuestions: number;
  type: QuestionType;
}