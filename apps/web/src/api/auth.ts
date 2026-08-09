import { api } from "./axios";
import type { SignInType } from "@repo/types";
export async function refreshAccessToken() {
  return api.post("/auth/refresh");
}

export async function login(data: SignInType) {
  return api.post("/auth/login", data);
}

export async function logout() {
  return api.post("/auth/logout");
  
}

export async function getProfile() {
  return api.get("/users/profile");
}

export async function LoginStudent(data: SignInType) {
  return api.post("/auth/signIn/student", data);
}