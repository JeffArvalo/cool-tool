import { AuthService } from './auth.service';
import { Body, Controller, Post, Query, UseGuards, Req } from '@nestjs/common';
import type { Request as RequestType } from 'express';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import {
  EmailUserDto,
  PasswordUserDto,
  TokenUserDto,
  UserSignInResponseDto,
} from 'src/user/dto/sign-user.dto';
import { UserResponseDto } from 'src/user/dto/response-user.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signInUser(@Req() req: RequestType): Promise<UserSignInResponseDto> {
    return await this.authService.login(req.user as UserResponseDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  signOutUser(@Req() req: RequestType) {
    const token = req.headers?.authorization?.replace('Bearer ', '');
    return this.authService.signOut(token || '');
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { ttl: 30000, limit: 3 } })
  @Post('forgot')
  async forgotPassword(@Body() emailUserDto: EmailUserDto) {
    return await this.authService.forgotPassword(emailUserDto);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { ttl: 30000, limit: 3 } })
  @Post('reset-password')
  async resetPassword(
    @Query() token: TokenUserDto,
    @Body() passwordUserDto: PasswordUserDto,
  ) {
    return await this.authService.resetPassword(token, passwordUserDto);
  }
}
