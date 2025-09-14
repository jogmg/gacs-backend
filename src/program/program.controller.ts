import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { ProgramService } from './program.service';

@Controller('programs')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Post()
  async create(@Body() createProgramDto: CreateProgramDto) {
    return await this.programService.create(createProgramDto);
  }

  @Get()
  async findAll() {
    return await this.programService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.programService.findOneById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProgramDto: UpdateProgramDto,
  ) {
    return await this.programService.update(id, updateProgramDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.programService.delete(id);
  }
}
