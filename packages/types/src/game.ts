export interface GenerateQuestionsRequest {
    content?: string | null;
    numberOfQuestions: number;
    type: 'multiple-choice' | 'true-false' | 'short-answer';
}