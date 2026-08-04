import type { Student, StudentStatus } from "../types";

/**
 * Derives a status badge from StudentAnalytics.averageScore, since the
 * Prisma schema has no `status` field on Students/StudentAnalytics.
 * Adjust the thresholds to match how the teacher-facing copy should read.
 */
export function getStudentStatus(student: Student): StudentStatus {
  const score = student.analytics?.averageScore ?? 0;
  if (score >= 80) return "on-track";
  if (score >= 60) return "watch";
  return "needs-attention";
}