import { api } from "./axios";
import type {
  ClassRoster,
  MessageResponse,
  RegisterStudentInput,
  Student,
  TrendPoint,
  UpdateStudentInput,
} from "../types";

interface PerformanceParams {
  classId?: string;
}
import type { StudentDashboardData } from "@repo/types";
// These two stay unconfirmed — nothing in StudentsService backs them.
// If performance analytics end up living on StudentsService too, adjust
// the paths/response shape to match once that controller exists.
export async function getStudentPerformance(params: PerformanceParams = {}) {
  return api.get<Student[]>("/analytics/students/performance", { params });
}

import type { StudentPerformanceResponse, TrendPointResponse } from "@repo/types";

interface ClassScopedParams {
  classId?: string;
}

export async function getStudentPerformanceTeacher(params: ClassScopedParams = {}) {
  return api.get<StudentPerformanceResponse[]>("/teacher/students/performance", { params });
}

export async function getPerformanceTrendTeacher(params: ClassScopedParams = {}) {
  return api.get<TrendPointResponse[]>("/teacher/students/trend", { params });
}

export async function getPerformanceTrend(params: PerformanceParams = {}) {
  return api.get<TrendPoint[]>("/analytics/performance-trend", { params });
}

// GET /students -> StudentsService.getAllStudentsFromUser. Returns every
// one of the teacher's classes with its active students nested — there's
// no single-class roster route to call instead (see note on
// getStudentsByClass below), so the frontend fetches everything and
// filters by classId client-side.
export async function getAllStudentRosters() {
  return api.get<ClassRoster[]>("/students");
}

// Matches StudentsService.registerStudent via RegisterStudentDto.
// Returns { message }, not the created student.
export async function registerStudent(data: RegisterStudentInput) {
  return api.post<MessageResponse>("/students/register", data);
}

// Matches StudentsService.updateStudent.
export async function updateStudent(
  studentId: string,
  data: UpdateStudentInput
) {
  return api.put<MessageResponse>(`/students/${studentId}`, data);
}

// Soft-delete — service sets isActive: false rather than removing the row.
export async function deleteStudent(studentId: string) {
  return api.delete<MessageResponse>(`/students/${studentId}`);
}

export async function getStudentDashboard() {
  return api.get<StudentDashboardData>(`/student/dashboard`);
}

export async function isGameSessionExist(): Promise<{ message: string; exists: boolean }> {
  const response = await api.get(`/game/isGameSession`);
  return response.data;
}