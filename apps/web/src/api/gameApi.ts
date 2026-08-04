import { api } from "./axios";

export async function createQuizSession(classId: string | null | undefined) {
    if (!classId) {
        throw new Error("classId is required to start a quiz session");
    }
    return api.post(`/game/create`, { classId });
}