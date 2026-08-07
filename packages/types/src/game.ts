export interface GenerateQuestionsRequest {
    content?: string | null;
    numberOfQuestions: number;
    type: 'multiple-choice' | 'true-false' | 'short-answer';
}

export interface addQuestionsToSessionRequest {
    classId: string;
    question: string;
    choices?: string[] | null;
    type: 'multiple-choice' | 'true-false' | 'short-answer';
    answer: string;
}

export interface quizSession {
    classId: string;
    students: { id: string; name: string; isInGame: boolean }[];
    createdAt: string;
    status: 'active' | 'inactive';
    isStarted: boolean;
}

export interface removeQuestionsFromSessionRequest {
    classId: string;
    questionIds: string[];
}

export interface createQuizSessionResponse {
    sessionId: string;
    message: string;
}