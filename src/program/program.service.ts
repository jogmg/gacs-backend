import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { Program } from './entities/program.entity';

@Injectable()
export class ProgramService {
  constructor(
    @InjectModel(Program.name) private programService: Model<Program>,
  ) {}

  async create(createProgramDto: CreateProgramDto) {
    return await this.programService.create(createProgramDto);
  }

  async findAll() {
    return await this.programService.find();
    // .populate<{ institution: Institution }>('institution', '-password');
  }

  async findByInstitutionId(institutionId: string) {
    return await this.programService.find({ institution: institutionId });
  }

  async findOne(id: string) {
    return await this.programService.findById(id);
  }

  async update(id: string, updateProgramDto: UpdateProgramDto) {
    return await this.programService.findByIdAndUpdate(id, updateProgramDto);
  }

  async delete(id: string) {
    return this.programService.findByIdAndDelete(id);
  }
}
