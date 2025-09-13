import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentService } from './student.service';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    return await this.studentService.create(createStudentDto);
  }

  @Get()
  async findAll() {
    return await this.studentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.studentService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return await this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.studentService.delete(id);
  }
}
