import { api } from "./axios";
import type { ClassItem, Student } from "../types/dashboard.types";

export async function getClasses() {
  return api.get<ClassItem[]>("/classes");
}

export async function getClassById(classId: string) {
  return api.get<ClassItem>(`/classes/${classId}`);
}

export async function getClassRoster(classId: string) {
  return api.get<Student[]>(`/classes/${classId}/students`);
}