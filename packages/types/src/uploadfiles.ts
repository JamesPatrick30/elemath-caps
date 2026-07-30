export interface workerQueueDataFile {
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