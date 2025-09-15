import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentService: Model<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    return await this.studentService.create(createStudentDto);
  }

  async createMany(createStudentDto: CreateStudentDto[]) {
    return await this.studentService.insertMany(createStudentDto);
  }

  async findAll() {
    return await this.studentService.find();
  }

  async findByInstitutionId(institutionId: string) {
    return await this.studentService.find({ institution: institutionId });
  }

  async findOne(id: string) {
    return await this.studentService.findById(id);
  }

  async findOneByInstitution(institutionId: string, studentCode: string) {
    return await this.studentService.findOne({
      institution: institutionId,
      code: studentCode,
    });
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    return await this.studentService.findByIdAndUpdate(id, updateStudentDto, {
      new: true,
    });
  }

  async findOneByInstituitonAndUpdate(
    institutionId: string,
    studentCode: string,
    updateStudentDto: UpdateStudentDto,
  ) {
    return await this.studentService.findOneAndUpdate(
      { institution: institutionId, code: studentCode },
      updateStudentDto,
      { new: true },
    );
  }

  async delete(id: string) {
    return await this.studentService.findByIdAndDelete(id);
  }
}
