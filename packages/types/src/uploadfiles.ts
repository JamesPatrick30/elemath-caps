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


export interface uploadTask {
    id: string;
    status: string;
    isDone: boolean;
    userId?: string;
}

export interface checkCacheStatusResponse {
    processing: boolean;
    status: string;
}