import { Injectable } from '@nestjs/common';
import { CertificateService } from 'src/certificate/certificate.service';
import { ProgramService } from 'src/program/program.service';
// import { StudentService } from 'src/student/student.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class InstitutionService {
  constructor(
    private userService: UserService,
    private programService: ProgramService,
    private certificateService: CertificateService,
    // private studentService: StudentService,
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
}
