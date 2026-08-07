import { api } from "./axios";
import type { MessageResponse, StartSessionInput, QuizSessiondata } from "../types";
import type { createQuizSessionResponse } from "@repo/types";
// Base path confirmed: @Controller('game').

// GameService.CreateQuizSession returns Promise<void> and the controller
// returns that directly — the response body is empty. Don't read
// anything off this call; fetch the real session via getGameSession
// right after.
export async function createQuizSession(classId: string) {
  return api.post<createQuizSessionResponse>("/game/create", { classId } satisfies StartSessionInput);
}

// The one call that actually returns session data — the cached
// quizSession object (see QuizSession in types/index.ts).
export async function getGameSession(classId: string) {
  return api.get<QuizSessiondata>(`/game/session/${classId}`);
}

export async function cancelQuizSession(classId: string) {
  return api.post<MessageResponse>("/game/cancel", { classId } satisfies StartSessionInput);
}

// Kicks off the live quiz — the backend takes over via sockets from here.
export async function startQuizSession(classId: string) {
  return api.post<MessageResponse>(`/game/start/${classId}`);
}

// Confirmed route, resolves void — no body to read. Not wired into any
// UI yet (nothing requested a manual question editor).
export async function removeQuestions(classId: string, questionIds: string[]) {
  return api.delete<void>("/game/questions/remove", {
    data: { classId, questionIds },
  });
}

export async function isQuizSessionExist() {
  return api.get<boolean>("/game/isSessionExist/teacher");
}

// api/gameApi.ts
// import type { GenerateQuestionsRequest, AddQuestionRequest } from "@repo/types";

export const generateQuestions = (payload: any) => {
    return api.post("/game/generate/questions", payload);
};

export const addQuestion = async (payload: any) => {
  try{
    const response = await api.post("/game/questions/add", payload);
    console.log("Question added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding question:", error);
  }
};