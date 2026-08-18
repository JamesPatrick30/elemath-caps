export interface GenerateQuestionsRequest {
    classId: string;
    lessonId: string | null;
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
    students: { id: string; name: string; isInGame: boolean; joinedAt: number | null, isDone: boolean }[];
    createdAt: string;
    status: 'active' | 'inactive';
    isStarted: boolean;
    isSessionDone: boolean;
}

export interface removeQuestionsFromSessionRequest {
    classId: string;
    questionIds: string[];
}

export interface createQuizSessionResponse {
    sessionId: string;
    message: string;
}

export interface updateStudentScore{
    studentId: string;
    score: number;
}
export interface generateQuestionsQueueData {
    roomKey: string;
    roomQuestionsKey: string;
    moduleId: string;
    numberOfQuestions: number;
    type: 'multiple-choice' | 'true-false' | 'short-answer';
}

export interface QuestionAiOutput {
    question: string;
    answer: string;
}

export interface QuestionResponse{
    question: string;
}
export interface MultipleChoiceAiOutput extends QuestionAiOutput, QuestionResponse {
    options: string[];
}
export interface QuestionSave extends QuestionAiOutput {
    id: string;
    options?: string[];
}

export interface QuestionIdResponse extends QuestionResponse {
    id: string;
    options?: string[];
}
export interface TrueFalseAiOutput extends QuestionAiOutput, QuestionResponse {
    options: ["True", "False"];
}

export interface ShortAnswerAiOutput extends QuestionAiOutput, QuestionResponse {
}

export interface QuestionSave extends QuestionAiOutput {
    id: string;
}

export interface QuestionIdResponse extends QuestionResponse{
    id:string
}
export interface QuizStudentData {
    type: 'multiple-choice' | 'true-false' | 'short-answer';
    isSessionDone: boolean;
    questions: QuestionSave[];
}

export interface GetQuizQuestionsResponse{
    type: 'multiple-choice' | 'true-false' | 'short-answer';
    question: QuestionIdResponse| null;
}

export interface StudentLeaderboardTable {
    id: string;
    name: string;
    score: number;
}

export interface LeaderboardResponse {
    leaderboard: StudentLeaderboardTable[];
    isSessionDone: boolean;
}