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

import { UploadPdfDto } from './dto/upload.dto';
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
    @Body() body: UploadPdfDto
    ) {
    await this.pdfService.addPdfJob({
        fileName: file.filename,
        originalName: file.originalname,
        path: file.path,
        classId: body.classId,
    });

    return {
        success: true,
    };
    }
}
