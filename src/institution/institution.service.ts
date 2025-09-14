import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import AdmZip from 'adm-zip';
import { lastValueFrom } from 'rxjs';
import { CertificateService } from 'src/certificate/certificate.service';
import { ProgramService } from 'src/program/program.service';
import { normalizeToLowercase } from 'src/shared/utils/helper.utils';
import { generateCertificate } from 'src/shared/utils/pdf-generator.utils';
import { StudentService } from 'src/student/student.service';
import { UserService } from 'src/user/user.service';
import { Readable } from 'stream';
import * as XLSX from 'xlsx';

@Injectable()
export class InstitutionService {
  constructor(
    private userService: UserService,
    private programService: ProgramService,
    private certificateService: CertificateService,
    private studentService: StudentService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getDashboard(institutionId: string) {
    const institution = await this.userService.findOneById(institutionId);
    const programs =
      await this.programService.findByInstitutionId(institutionId);
    const certificates =
      await this.certificateService.findByInstitutionId(institutionId);

    const dashboardData = {
      institutionName: institution?.name,
      programCount: programs.length,
      certificateCount: certificates.length,
    };

    return dashboardData;
  }

  async generateStudentCode(institutionId: string, programId: string) {
    const institution =
      await this.userService.incrementStudentCount(institutionId);
    if (!institution) throw new NotFoundException('Institution not found');

    const program = await this.programService.findOneById(programId);
    if (!program) throw new NotFoundException('Program not found');

    const studentCode =
      program.code + String(institution.studentCount).padStart(4, '0');
    return studentCode;
  }

  async uploadStudentData(file: Express.Multer.File, institutionId: string) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const students = XLSX.utils.sheet_to_json(sheet);

    const studentDocs = await Promise.all(
      students.map(async (student: any) => {
        let program = await this.programService.findOneByName(
          student['Program'],
        );

        if (!program) {
          const newProgram = {
            institution: institutionId,
            name: student['Program'],
          };
          program = await this.programService.create(newProgram);
        }

        const studentCode = await this.generateStudentCode(
          institutionId,
          String(program._id),
        );

        return {
          institution: institutionId,
          program: String(program._id),
          code: studentCode,
          name: student['Name'],
          graduationDate: XLSX.SSF.format(
            'yyyy-mm-dd',
            student['Graduation Date'],
          ),
        };
      }),
    );

    return await this.studentService.createMany(studentDocs);
  }

  async uploadStudentImage(file: Express.Multer.File, institutionId: string) {
    const formData = new FormData();
    formData.append(
      'image',
      new Blob([new Uint8Array(file.buffer)]),
      file.originalname,
    );

    const studentCode = file.originalname.split('.')[0];

    const student = await this.studentService.findOneByInstitution(
      institutionId,
      studentCode,
    );

    if (!student) {
      return new NotFoundException('Student not found').getResponse();
    }

    const response = await lastValueFrom(
      this.httpService.post('https://api.imgbb.com/1/upload', formData, {
        params: { key: this.configService.get<string>('IMGBB_API_KEY') },
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    );

    const imgUpdate = { imgURL: response.data.data.url };

    return await this.studentService.findOneByInstituitonAndUpdate(
      institutionId,
      studentCode,
      imgUpdate,
    );
  }

  private getMimeType(filename: string) {
    const extension = filename.split('.').pop()?.toLowerCase();
    const mimeTypes = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      bmp: 'image/bmp',
      tiff: 'image/tiff',
    };
    return mimeTypes[extension!] || 'application/octet-stream';
  }

  async uploadStudentImages(
    zipFile: Express.Multer.File,
    institutionId: string,
  ) {
    const zip = new AdmZip(zipFile.buffer);
    const zipEntries = zip.getEntries().filter((entry) => !entry.isDirectory);

    const results = Promise.all(
      zipEntries.map(async (entry) => {
        const bufferStream = Readable.from(entry.getData());

        // Create a mock Multer.File object from the zip entry
        const extractedFile: Express.Multer.File = {
          fieldname: 'file',
          originalname: entry.entryName,
          encoding: '7bit',
          mimetype: this.getMimeType(entry.entryName),
          buffer: entry.getData(),
          size: entry.getData().length,
          stream: bufferStream,
          destination: '',
          filename: '',
          path: '',
        };

        const result = await this.uploadStudentImage(
          extractedFile,
          institutionId,
        );

        return {
          filename: entry.entryName,
          data: result,
        };
      }),
    );

    return results;
  }

  async generateStudentCertificate(institutionId: string, studentId: string) {
    const newCertificate = await this.certificateService.create({
      institution: institutionId,
      student: studentId,
    });

    const studentName = normalizeToLowercase(newCertificate.student.name);
    const studentCode = newCertificate.student.code;

    const verificationUrl = `${this.configService.get<string>('FRONTEND_URL')}/verify`;
    const pdfBuffer = generateCertificate(newCertificate, verificationUrl);

    return {
      fileName: `${studentName}_${studentCode}_graduation_certificate.pdf`,
      pdfBuffer,
    };
  }
}
