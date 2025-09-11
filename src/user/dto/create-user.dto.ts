import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsEnum(['guest', 'admin', 'institution'], {
    message: 'userType must be either guest, admin, or institution',
  })
  userType: 'guest' | 'admin' | 'institution';

  //   @IsStrongPassword({
  //     minLength: 6,
  //     minLowercase: 1,
  //     minUppercase: 1,
  //     minNumbers: 1,
  //     minSymbols: 1,
  //   })
  @IsNotEmpty()
  password: string;

  @IsOptional()
  organization: string;
}
