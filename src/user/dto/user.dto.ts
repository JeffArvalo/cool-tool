import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Exclude } from 'class-transformer';
import {
  IsUUID,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsDate,
} from 'class-validator';

export class GetUserDto {
  @IsUUID()
  readonly id!: string;
}

export class CreateUserDto {
  @IsUUID()
  @IsOptional()
  readonly id!: string;

  @IsString()
  @IsNotEmpty()
  readonly firstName!: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName!: string;

  @IsString()
  @IsEmail()
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  readonly password!: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly phone!: string | null;

  @IsUUID()
  readonly roleId!: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly resetToken!: string | null;

  @IsDate()
  @IsOptional()
  createdAt!: Date;

  @IsDate()
  @IsOptional()
  updatedAt!: Date | null;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

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

export class UserResponseDto extends OmitType(CreateUserDto, [
  'password',
] as const) {
  @Exclude()
  password: string;
}

export class UserSignInResponseDto {
  @IsUUID()
  id!: string;

  @IsEmail()
  email: string;

  @IsString()
  token: string;
}
