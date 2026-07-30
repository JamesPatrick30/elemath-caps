import { IsNotEmpty, IsString } from 'class-validator';
import {pdfUploadRequest} from '@repo/types';
export class UploadPdfDto implements pdfUploadRequest {

    @IsNotEmpty()
    @IsString()
    classId!: string;
}