import { api } from "./axios";
import type { Student, TrendPoint } from "../types/dashboard.types";

interface PerformanceParams {
  classId?: string;
}

export async function getStudentPerformance(params: PerformanceParams = {}) {
  return api.get<Student[]>("/analytics/students/performance", { params });
}

export async function getPerformanceTrend(params: PerformanceParams = {}) {
  return api.get<TrendPoint[]>("/analytics/performance-trend", { params });
}

export async function getStudentById(studentId: string) {
  return api.get<Student>(`/students/${studentId}`);
}