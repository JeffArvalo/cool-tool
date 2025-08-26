import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  EmailUserDto,
  PasswordUserDto,
  SignInUserDto,
  TokenUserDto,
  UserResponseDto,
} from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { RoleService } from 'src/role/role.service';

let tokenBlacklist: { token: string; expiresAt: number }[] = [];

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
  ) {}

  async validateUser(user: SignInUserDto): Promise<UserResponseDto> {
    const foundUser = await this.userService.findByEmail(user.email);
    if (!(await bcrypt.compare(user.password, foundUser.password))) {
      throw new UnauthorizedException('Invalid password');
    }
    return plainToInstance(UserResponseDto, foundUser);
  }

  async login(user: UserResponseDto) {
    const role = await this.roleService.findById(user.roleId);
    const payload = {
      sub: { id: user.id, email: user.email, role: role?.name },
    };
    return this.jwtService.sign(payload);
  }

  signOut(token: string) {
    try {
      const decoded: any = this.jwtService.decode(token);
      const exp = decoded?.exp;
      if (exp) {
        tokenBlacklist.push({ token, expiresAt: exp * 1000 });
      }
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
    return token;
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

      const updatedUser = await this.userService.updateUser(user.id, {
        password: newPasswordDto.newPassword,
        resetToken: null,
      });

      return updatedUser;
    } else {
      throw new UnauthorizedException('No reset token found for this user');
    }
  }
  isTokenBlacklisted(token: string): boolean {
    const now = Date.now();
    tokenBlacklist = tokenBlacklist.filter((entry) => entry.expiresAt >= now);

    return tokenBlacklist.some((entry) => entry.token.includes(token));
  }
}
