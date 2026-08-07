// api/pdfApi.ts
// NOTE: adjust the axios import to whatever instance gameApi.ts uses
// (the one with cookie-based auth already configured).
import {api} from "./axios";

export const uploadPdf = (
    classId: string,
    file: File,
    onProgress?: (percent: number) => void
) => {
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("classId", classId);

    return api.post("/pdf/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event:any) => {
            if (onProgress && event.total) {
                onProgress(Math.round((event.loaded * 100) / event.total));
            }
        },
    });
};

export const getPdf = async (classId: string): Promise<{id: string; fileName: string; context: string;}[] | null> => {
    const response = await api.get(`/pdf/${classId}`);
    console.log('getPdf response:', response.data);
    return response.data;
};