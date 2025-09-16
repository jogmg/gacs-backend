import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { CertificateModule } from 'src/certificate/certificate.module';
import { ProgramModule } from 'src/program/program.module';
import { StudentModule } from 'src/student/student.module';
import { UserModule } from 'src/user/user.module';
import { InstitutionController } from './institution.controller';
import { InstitutionService } from './institution.service';

@Module({
  imports: [
    UserModule,
    StudentModule,
    ProgramModule,
    CertificateModule,
    HttpModule,
  ],
  controllers: [InstitutionController],
  providers: [InstitutionService],
  exports: [InstitutionService],
})
export class InstitutionModule {}
