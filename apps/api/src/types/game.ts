import type { socketEvents } from "@repo/types";
export interface addQuestion {
    question: string;
    type: "multiple-choice" | "true-false" | "short-answer";
    choices?: string[] | null | undefined;
    answer: string;
}

export interface getQuestionsResponse extends addQuestion {
    id: string;
}

