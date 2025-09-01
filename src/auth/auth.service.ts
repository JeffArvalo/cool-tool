import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  EmailUserDto,
  PasswordUserDto,
  SignInUserDto,
  TokenUserDto,
  UserSignInResponseDto,
} from 'src/user/dto/sign-user.dto';
import { UserResponseDto } from 'src/user/dto/response-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { RoleService } from 'src/role/role.service';
import { RedisService } from 'src/redis/redis.service';

let tokenBlacklist: { token: string; expiresAt: number }[] = [];

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
    private readonly redisService: RedisService,
  ) {}

  async validateUser(user: SignInUserDto): Promise<UserResponseDto> {
    const foundUser = await this.userService.findByEmail(user.email);
    if (!(await bcrypt.compare(user.password, foundUser.password))) {
      throw new UnauthorizedException('Invalid password');
    }
    return plainToInstance(UserResponseDto, foundUser);
  }

  async login(user: UserResponseDto): Promise<UserSignInResponseDto> {
    const role = await this.roleService.findById(user.roleId);
    const payload = {
      sub: { id: user.id, email: user.email, role: role?.name },
    };
    const token = this.jwtService.sign(payload);
    return { id: user.id, email: user.email, token: `bearer ${token}` };
  }

  async signOut(token: string) {
    try {
      const cleanToken = token.replace(/^bearer\s+/i, '');
      const decoded: any = this.jwtService.decode(cleanToken);
      const exp = decoded?.exp;
      if (exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        const ttl = exp - currentTime;

        if (ttl > 0) {
          await this.redisService.blacklistToken(cleanToken, ttl);
        }
      }
      return { message: 'User signed out successfully' };
    } catch (e) {
      console.error(e);
    }
  }

  async forgotPassword(emailUser: EmailUserDto) {
    const user = await this.userService.findByEmail(emailUser.email);
    const payload = {
      sub: { id: user.id, email: user.email },
    };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });
    const hasedToken = await bcrypt.hash(token, 10);
    await this.userService.updateUser(user.id, {
      resetToken: hasedToken,
    });
    return {
      message: 'Your token to reset password, expired in 1 hour',
      token,
    };
  }

  async resetPassword(tokenDto: TokenUserDto, newPasswordDto: PasswordUserDto) {
    const validateToken = this.jwtService.verify(tokenDto.token);
    if (!validateToken) {
      throw new UnauthorizedException();
    }

    const decoded: any = this.jwtService.decode(tokenDto.token);
    const user = await this.userService.findById(decoded.sub.id);

    if (user.resetToken) {
      const isTokenValid = await bcrypt.compare(
        tokenDto.token,
        user.resetToken,
      );
      if (!isTokenValid) {
        throw new UnauthorizedException('Invalid reset token');
      }

      await this.userService.updateUser(user.id, {
        password: newPasswordDto.newPassword,
        resetToken: null,
      });

      return { message: 'Password reset successfully' };
    } else {
      throw new UnauthorizedException('No reset token found for this user');
    }
  }
  async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      const cleanToken = token.replace(/^bearer\s+/i, '');
      return await this.redisService.isTokenBlacklisted(cleanToken);
    } catch (error) {
      console.error('Error checking blacklist:', error);
      return false;
    }
  }
}
