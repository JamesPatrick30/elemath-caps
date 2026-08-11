// ─── User / Teacher ──────────────────────────────────────────────
export interface TeacherResponse {
  id: string;
  email: string;
  name: string | null;
  isActive: boolean;
  createdAt: string; // ISO string over the wire
  updatedAt: string;
}

// ─── Students ─────────────────────────────────────────────────────
export interface StudentResponse {
  id: string;
  teacherId: string;
  classroomId: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentAnalyticsResponse {
  id: string;
  studentId: string;
  quizzesTaken: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  totalTimeSpent: number; // seconds
  accuracy: number;
}

// Used by StudentTable — student + their rolled-up analytics + which
// class they belong to (denormalized for display, joined server-side)
export interface StudentPerformanceResponse extends StudentResponse {
  className: string;
  analytics: StudentAnalyticsResponse | null;
}

// ─── Class ────────────────────────────────────────────────────────
export interface ClassAnalyticsResponse {
  id: string;
  classId: string;
  totalStudents: number;
  quizzesCreated: number;
  quizzesCompleted: number;
  averageScore: number;
}

export interface ClassResponse {
  id: string;
  teacherId: string;
  name: string;
  habitat: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// GET /classes — what ClassOverview / ClassCard actually render
export interface ClassItemResponse extends ClassResponse {
  studentCount: number;
  quizCount: number;
  classAnalytics: ClassAnalyticsResponse | null;
}

// ─── Lessons / Uploaded Files ─────────────────────────────────────
export interface LessonResponse {
  id: string;
  classId: string;
  title: string;
  pdfUrl: string;
  questions: QuizQuestion[];
  summary: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UploadedFileResponse {
  id: string;
  classId: string;
  fileName: string;
  questions: QuizQuestion[];
  summary: string | null;
  pptUrl: string[] | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Quiz ─────────────────────────────────────────────────────────
export interface QuizQuestion {
  question: string;
  choices: string[];
  correctIndex: number;
}

export interface QuizResponse {
  id: string;
  teacherId: string;
  classId: string;
  title: string;
  questions: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface QuestionAnalyticsResponse {
  id: string;
  quizId: string;
  questionIndex: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
}

export interface QuizAnalyticsResponse {
  id: string;
  quizId: string;
  attempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  averageDuration: number; // seconds
  completionRate: number; // 0–1
}

export interface QuizAttemptResponse {
  id: string;
  quizId: string;
  studentId: string;
  startedAt: string;
  submittedAt: string | null;
  score: number;
  totalItems: number;
  durationSec: number;
}

// GET /students/performance/trend — one point per quiz/date bucket
export interface TrendPointResponse {
  label: string; // quiz title or date bucket, e.g. "Quiz 4" / "Aug 4"
  date: string;
  averageScore: number;
  attempts: number;
}

// ─── Live Quiz Session (game gateway, not a Prisma model) ─────────
export type QuizSessionStatus = "waiting" | "active" | "finished";

export interface CreateQuizSessionResponse {
  sessionId: string;
  quizId: string;
  classId: string;
  status: QuizSessionStatus;
  joinCode: string;
  createdAt: string;
}

export interface SessionStudentResponse {
  studentId: string;
  name: string;
  joinedAt: string;
}

export interface GetGameSessionResponse extends CreateQuizSessionResponse {
  students: SessionStudentResponse[];
}

// Add to packages/types/src/index.ts

export interface DashboardStatsResponse {
  totalClasses: number;
  totalStudents: number;
  averageScore: number; // rounded 0–100, mean of each class's averageScore
  needsAttention: number; // count of students with averageScore < 60
}