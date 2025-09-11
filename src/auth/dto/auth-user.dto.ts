import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthUserDto {
  @IsEmail()
  userEmail: string;

  @IsNotEmpty()
  userPassword: string;
}
