import { IsMongoId } from 'class-validator';

export class CreateCertificateDto {
  @IsMongoId()
  institution: string;

  @IsMongoId()
  student: string;
}
