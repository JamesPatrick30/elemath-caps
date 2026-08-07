import type { socketEvents } from "@repo/types";

export const SocketEvents: socketEvents = {
    QUIZ_STARTED: 'quiz-started',
    QUIZ_ENDED: 'quiz-ended',
    PDF_UPLOADED: 'pdf-uploaded',
    STUDENT_JOIN: 'student-join',
};