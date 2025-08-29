import { OmitType } from '@nestjs/mapped-types';
import { Exclude } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

export class UserResponseDto extends OmitType(CreateUserDto, [
  'password',
] as const) {
  @Exclude()
  password: string;
}
