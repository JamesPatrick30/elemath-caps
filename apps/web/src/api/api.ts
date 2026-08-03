import { api } from "./axios";

export async function refreshAccessToken() {
  const response = await api.post("/auth/refresh");

  return response.data;
}