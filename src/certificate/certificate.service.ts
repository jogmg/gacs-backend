import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from 'src/student/entities/student.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { Certificate } from './entities/certificate.entity';

@Injectable()
export class CertificateService {
  constructor(
    @InjectModel(Certificate.name)
    private certificateService: Model<Certificate>,
  ) {}

  async create(createCertificateDto: CreateCertificateDto) {
    return (
      await this.certificateService.create(createCertificateDto)
    ).populate<{ institution: User; student: Student }>([
      { path: 'institution', select: '-password' },
      { path: 'student' },
    ]);
  }

  async findAll() {
    return await this.certificateService.find();
  }

  async findByInstitutionId(institutionId: string) {
    return await this.certificateService.find({ institution: institutionId });
  }

  async findByInstitutionAndStudent(institutionId: string, studentId: string) {
    return await this.certificateService
      .findOne({
        institution: institutionId,
        student: studentId,
      })
      .populate<{ institution: User; student: Student }>([
        { path: 'institution', select: '-password' },
        { path: 'student' },
      ]);
  }

  async findOne(id: string) {
    return await this.certificateService.findById(id);
  }

  async update(id: string, updateCertificateDto: UpdateCertificateDto) {
    return await this.certificateService.findByIdAndUpdate(
      id,
      updateCertificateDto,
      { new: true },
    );
  }

  async delete(id: string) {
    return await this.certificateService.findByIdAndDelete(id);
  }
}
