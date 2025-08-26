import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { RoleService } from 'src/role/role.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { CurrentUser } from 'src/auth/strategies/types/current-user';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const user: CurrentUser = req.user as CurrentUser;
    return this.userService.findById(user.id);
  }

  @Roles('manager')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('create/manager')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createManager(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUser(@Body() createUserDto: CreateUserDto) {
    const role = await this.roleService.findByName('client');
    if (role?.id !== createUserDto.roleId) {
      throw new ConflictException('Try to create user with invalid role');
    }
    return await this.userService.createUser(createUserDto);
  }
}
