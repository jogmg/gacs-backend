import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber('NG')
  phoneNumber?: string;

  // @IsEnum(['individual', 'organization'], {
  //   message: 'Type must be either individual or organization',
  // })
  // type: 'individual' | 'organization';

  //   @IsStrongPassword({
  //     minLength: 6,
  //     minLowercase: 1,
  //     minUppercase: 1,
  //     minNumbers: 1,
  //     minSymbols: 1,
  //   })
  @IsNotEmpty()
  password: string;

  // @IsOptional()
  // organization?: string;
}
