export interface workerQueueDataFile {
    userId: string;
    fileName: string;
    classId: string;
    originalName: string;
    path: string;
}

export interface pdfUploadRequest {
    classId: string;
}
export interface workerQueue {
    PDF: 'pdf';
    GenerateQuestions: 'generate-questions';
}

export interface uploadTask {
    id: string;
    status: string;
    isDone: boolean;
}