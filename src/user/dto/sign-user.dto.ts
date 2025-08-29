import { IsUUID, IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class SignInUserDto {
  @IsString()
  @IsEmail()
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  readonly password!: string;
}

export class EmailUserDto {
  @IsString()
  @IsEmail()
  email!: string;
}

export class PasswordUserDto {
  @IsString()
  @IsNotEmpty()
  newPassword!: string;
}

export class TokenUserDto {
  @IsString()
  @IsNotEmpty()
  token!: string;
}
export class UserSignInResponseDto {
  @IsUUID()
  id!: string;

  @IsEmail()
  email: string;

  @IsString()
  token: string;
}
