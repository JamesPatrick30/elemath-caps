import { api } from "./axios";
import type { MessageResponse, StartSessionInput, QuizSessiondata } from "../types";
import type { createQuizSessionResponse,GenerateQuestionsRequest, quizSession, GetQuizQuestionsResponse, LeaderboardResponse } from "@repo/types";
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

export const generateQuestions = (payload: GenerateQuestionsRequest) => {
    return api.post("/game/generate/questions", payload);
};

export const joinQuizSession = async (classId: string) => {
  try {
    const response = await api.post(`/game/join/${classId}`);
    console.log("Joined quiz session successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error joining quiz session:", error);
  }
}

export const getStudentsInSession = async (): Promise<quizSession['students']> => {
  try {
    const response = await api.get(`/game/students`);
    return response.data.students; // Assuming the API returns a list of students in the session
  } catch (error) {
    console.error("Error fetching students in session:", error);
    return [];
  }
};

export const getQuestion = async (): Promise<GetQuizQuestionsResponse | null> => {
  try {
    const response = await api.get(`/game/getQuestion`);
    return response.data; // Assuming the API returns a question object
  } catch (error) {
    console.error("Error fetching question:", error);
    return null;
  }
}

export const submitAnswer = async (answer: string,questionId: string ) =>{
  try {
    const res = await api.post("/game/submit/answer",{answer,questionId});
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export const leaderboard = async (classId: string): Promise<LeaderboardResponse> => {
  try {
    const response = await api.get(`/game/${classId}/leaderboard`);
    return response.data; // Assuming the API returns a list of students with their scores
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return { leaderboard: [], isSessionDone: false };
  }
}

export const saveQuizSession = async (classId: string): Promise<{message: string}> => {
  try {
    const response = await api.post(`/game/${classId}/save`);
    return response.data; // Assuming the API returns a message confirming the save
  } catch (error) {
    console.error("Error saving quiz session:", error);
    return { message: "Error saving quiz session" };
  }
}