import {
    Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { PdfService } from './pdf.service';

import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
@Controller('pdf')
export class PdfController {
    constructor(private readonly pdfService: PdfService) {}

    @Post('upload')
    @UseInterceptors(
    FileInterceptor('pdf', {
        storage: diskStorage({
        destination: '../../uploads/pdfs',
        filename: (_, file, cb) => {
            const filename =
            `${Date.now()}-${Math.random().toString(36).slice(2)}${extname(file.originalname)}`;

            cb(null, filename);
        },
        }),
    }),
    )
    async upload(
    @UploadedFile() file: Express.Multer.File,
    ) {
    await this.pdfService.addPdfJob({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
    });

    return {
        success: true,
    };
    }
}
