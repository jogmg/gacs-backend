import {
  Controller,
  Get,
  Header,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { InstitutionService } from './institution.service';

@Controller('institutions')
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  @Get(':id/dashboard')
  async getDashboard(@Param('id') institutionId: string) {
    return await this.institutionService.getDashboard(institutionId);
  }

  @Post(':id/upload-students-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStudentData(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') institutionId: string,
  ) {
    return await this.institutionService.uploadStudentData(file, institutionId);
  }

  @Post(':institutionId/upload-student-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStudentImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('institutionId') institutionId: string,
  ) {
    return await this.institutionService.uploadStudentImage(
      file,
      institutionId,
    );
  }

  @Post(':institutionId/upload-student-images')
  @UseInterceptors(FileInterceptor('zipFile'))
  async uploadStudentImages(
    @UploadedFile() zipFile: Express.Multer.File,
    @Param('institutionId') institutionId: string,
  ) {
    return await this.institutionService.uploadStudentImages(
      zipFile,
      institutionId,
    );
  }

  @Post(':institutionId/generateCertificate/:studentId')
  @Header('Content-Type', 'application/pdf')
  async generateStudentCertificate(
    @Param('institutionId') institutionId: string,
    @Param('studentId') studentId: string,
    @Res() res: Response,
  ) {
    const { pdfBuffer, fileName } =
      await this.institutionService.generateStudentCertificate(
        institutionId,
        studentId,
      );

    res.attachment(fileName);
    res.send(await pdfBuffer);
  }
}
