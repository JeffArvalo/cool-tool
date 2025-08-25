import { AuthService } from './auth.service';
import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import {
  EmailUserDto,
  PasswordUserDto,
  TokenUserDto,
} from 'src/user/dto/user.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signInUser(@Request() req) {
    const token = await this.authService.login(req.user);
    return { userId: req.user.id, email: req.user.email, token: token };
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  async signOutUser(@Request() req) {
    this.authService.signOut(req.headers.authorization.replace('Bearer ', ''));
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
