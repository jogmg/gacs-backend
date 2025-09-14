import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateStudentDto {
  @IsMongoId()
  institution: string;

  @IsMongoId()
  program: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  name: string;

  @IsDateString()
  graduationDate: string;

  @IsOptional()
  imgURL?: string;
}
