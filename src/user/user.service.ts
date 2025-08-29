import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto } from './dto/response-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { Prisma, UserAccount } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<UserResponseDto[]> {
    return this.prisma.userAccount.findMany();
  }

  async findById(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.userAccount.findUniqueOrThrow({
        where: { id: id },
      });

      return plainToInstance(UserResponseDto, user);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        if (e.code === 'P2025') e.message = 'User not found';

      throw e;
    }
  }

  async createUser(user: CreateUserDto): Promise<UserResponseDto> {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const userCreated = await this.prisma.userAccount.create({
        data: { ...user, password: hashedPassword },
      });
      return plainToInstance(UserResponseDto, userCreated);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          e.message = 'User already exists with this email';
        if (e.code === 'P2003') e.message = 'Role does not exist';
      }
      throw e;
    }
  }

  async updateUser(id: string, user: UpdateUserDto): Promise<UserResponseDto> {
    try {
      let userUpdated;
      if (user.password) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        userUpdated = await this.prisma.userAccount.update({
          data: { ...user, password: hashedPassword },
          where: { id },
        });
      } else {
        userUpdated = await this.prisma.userAccount.update({
          data: { ...user },
          where: { id },
        });
      }

      return plainToInstance(UserResponseDto, userUpdated);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2003') e.message = 'Role does not exist';
        if (e.code === 'P2025') e.message = 'User not found';
      }
      throw e;
    }
  }

  async findByEmail(email: string): Promise<UserAccount> {
    try {
      return await this.prisma.userAccount.findUniqueOrThrow({
        where: { email: email },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') e.message = 'User not found';
      }
      throw e;
    }
  }
}
