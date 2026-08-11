import { api } from "./axios";
import type { TeacherResponse, DashboardStatsResponse } from "@repo/types";

export async function getTeacherProfile() {
  return api.get<TeacherResponse>("/teacher/dashboard");
}

export async function getDashboardStats() {
  return api.get<DashboardStatsResponse>("/teacher/dashboard/stats");
}