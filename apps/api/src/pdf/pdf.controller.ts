import {
    Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { PdfService } from './pdf.service';
import { AccessTeacherGuard } from '../auth/guard/accessTeacher.guard';
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import type { Request } from "express";
import { UploadPdfDto } from './dto/upload.dto';
@Controller('pdf')
@UseGuards(AccessTeacherGuard)
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
        @Body() body: UploadPdfDto,
        @Req() req : Request
    ) {
            
        await this.pdfService.addPdfJob({
            userId: req.user.sub,
            fileName: file.filename,
            originalName: file.originalname,
            path: file.path,
            classId: body.classId,
        });

        return {
            success: true,
        };
    }

    @Get(':classId/lessons')
    async getPdf(@Param('classId') classId: string) {
        return this.pdfService.getPdf(classId);
    }

    @Get('processing')
    async getProcessingFiles( @Req() req : Request) {
        return this.pdfService.getProcessingFile(req.user.sub);
    }
}
