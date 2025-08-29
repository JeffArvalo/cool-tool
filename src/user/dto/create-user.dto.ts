import {
  IsUUID,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsDate,
} from 'class-validator';

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
