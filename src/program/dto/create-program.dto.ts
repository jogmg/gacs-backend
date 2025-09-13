import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateProgramDto {
  @IsMongoId()
  institution: string;

  @IsNotEmpty()
  name: string;
}
