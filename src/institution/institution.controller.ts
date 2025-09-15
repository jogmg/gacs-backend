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

  @Post(':id/upload-bulk-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBulkData(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') institutionId: string,
  ) {
    return await this.institutionService.uploadBulkData(file, institutionId);
  }

  @Post(':institutionId/upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('institutionId') institutionId: string,
  ) {
    return await this.institutionService.uploadImage(file, institutionId);
  }

  @Post(':institutionId/upload-bulk-images')
  @UseInterceptors(FileInterceptor('zipFile'))
  async uploadBulkImages(
    @UploadedFile() zipFile: Express.Multer.File,
    @Param('institutionId') institutionId: string,
  ) {
    return await this.institutionService.uploadBulkImages(
      zipFile,
      institutionId,
    );
  }

  @Post(':institutionId/generate-certificate/:studentId')
  @Header('Content-Type', 'application/pdf')
  async generateCertificate(
    @Param('institutionId') institutionId: string,
    @Param('studentId') studentId: string,
    @Res() res: Response,
  ) {
    const { pdfBuffer, fileName } =
      await this.institutionService.generateCertificate(
        institutionId,
        studentId,
      );

    res.attachment(fileName);
    res.send(await pdfBuffer);
  }

  @Post(':institutionId/generate-bulk-certificates')
  @Header('Content-Type', 'application/pdf')
  async generateBulkCertificates(
    @Param('institutionId') institutionId: string,
    @Res() res: Response,
  ) {
    const certificates =
      await this.institutionService.generateBulkCertificates(institutionId);

    // If only one certificate, send it directly
    if (certificates.length === 1) {
      const { pdfBuffer, fileName } = certificates[0];
      res.attachment(fileName);
      return res.send(await pdfBuffer);
    }

    // If multiple certificates, zip them and send
    const { zipBuffer, zipFileName } =
      await this.institutionService.zipCertificates(certificates);

    res.attachment(zipFileName);
    res.send(zipBuffer);
  }
}
