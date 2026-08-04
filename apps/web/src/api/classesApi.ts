import { api } from "./axios";
import type {
  ClassItem,
  CreateClassInput,
  MessageResponse,
  UpdateClassInput,
} from "../types";

// GET /class -> ClassController.getUserClasses (scoped to the logged-in
// teacher via AccessTeacherGuard). Note: the service's findMany does not
// currently `include` classAnalytics, so that field will come back
// undefined until the backend adds the include.
export async function getClasses() {
  return api.get<ClassItem[]>("/class");
}

export async function createClass(data: CreateClassInput) {
  return api.post<MessageResponse>("/class/register", data);
}

export async function updateClass(classId: string, data: UpdateClassInput) {
  return api.put<MessageResponse>(`/class/${classId}`, data);
}

// Soft-delete — service sets isActive: false rather than removing the row.
export async function deleteClass(classId: string) {
  return api.delete<MessageResponse>(`/class/${classId}`);
}