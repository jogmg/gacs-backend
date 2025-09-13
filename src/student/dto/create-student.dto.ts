import { IsDateString, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateStudentDto {
  @IsMongoId()
  institution: string;

  @IsNotEmpty()
  program: string;

  @IsNotEmpty()
  name: string;

  @IsDateString()
  completionDate: string;
}
