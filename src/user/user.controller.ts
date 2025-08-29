import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { CurrentUser } from 'src/auth/strategies/types/current-user';
import { CustomAuthGuard } from 'src/auth/guards/custom-auth/custom-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const user = req.user as CurrentUser;
    return this.userService.findById(user.id);
  }

  @Roles('manager')
  @UseGuards(CustomAuthGuard)
  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }
}
