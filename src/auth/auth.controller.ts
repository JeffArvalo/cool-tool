import { AuthService } from './auth.service';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import type { Request as RequestType } from 'express';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import {
  EmailUserDto,
  PasswordUserDto,
  TokenUserDto,
  UserResponseDto,
  UserSignInResponseDto,
} from 'src/user/dto/user.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signInUser(@Req() req: RequestType): Promise<UserSignInResponseDto> {
    const user = req.user as UserResponseDto;
    const token = await this.authService.login(user);
    return { id: user.id, email: user.email, token: token };
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  signOutUser(@Req() req: RequestType) {
    const token = req.headers?.authorization?.replace('Bearer ', '');
    this.authService.signOut(token || '');
    return { message: 'User signed out successfully' };
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { ttl: 30000, limit: 3 } })
  @Post('forgot')
  @UsePipes(new ValidationPipe({ transform: true }))
  async forgotPassword(@Body() emailUserDto: EmailUserDto) {
    const token = await this.authService.forgotPassword(emailUserDto);
    return {
      message: 'Your token to reset password, expired in 1 hour',
      token,
    };
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { ttl: 30000, limit: 3 } })
  @Post('reset-password')
  @UsePipes(new ValidationPipe({ transform: true }))
  async resetPassword(
    @Query('token') token: string,
    @Body() passwordUserDto: PasswordUserDto,
  ) {
    const tokenDto = plainToInstance(TokenUserDto, { token });
    const errors = await validate(tokenDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const password = await this.authService.resetPassword(
      tokenDto,
      passwordUserDto,
    );
    if (!password) {
      throw new UnauthorizedException('Failed to reset password');
    }
    return { message: 'Password reset successfully' };
  }
}
