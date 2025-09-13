import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Program, ProgramSchema } from './entities/program.entity';
import { ProgramController } from './program.controller';
import { ProgramService } from './program.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Program.name, schema: ProgramSchema }]),
  ],
  controllers: [ProgramController],
  providers: [ProgramService],
  exports: [ProgramService],
})
export class ProgramModule {}
