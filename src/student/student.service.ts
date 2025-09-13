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

  async findAll() {
    return await this.studentService.find();
  }

  async findOne(id: string) {
    return await this.studentService.findById(id);
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    return await this.studentService.findByIdAndUpdate(id, updateStudentDto);
  }

  async delete(id: string) {
    return await this.studentService.findByIdAndDelete(id);
  }
}
