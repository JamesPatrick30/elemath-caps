import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller("pdf")
export class PdfController {
  @Post("upload")
  @UseInterceptors(
    FileInterceptor("pdf", {
      storage: diskStorage({
        destination: "../../../uploads/pdfs",
        filename: (_, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}${extname(file.originalname)}`;

          cb(null, uniqueName);
        },
      }),
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
      path: file.path,
      size: file.size,
    };
  }
}