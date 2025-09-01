import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { RoleService } from 'src/role/role.service';
import { Request } from 'express';

@Injectable()
export class CustomAuthGuard implements CanActivate {
  constructor(
    private jwtAuthGuard: JwtAuthGuard,
    private rolesGuard: RolesGuard,
    private roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.headers.authorization) {
      const role = await this.getClientRoleId();
      if (!request.body) throw new NotFoundException('Request body not found');
      if (request.body.roleId === role?.id) {
        return true;
      }
      throw new UnauthorizedException(
        'Token missing and role is not client. Access denied',
      );
    }

    const jwtValid = await this.jwtAuthGuard.canActivate(context);
    if (!jwtValid) {
      throw new UnauthorizedException('Invalid token');
    }

    const rolesValid = await this.rolesGuard.canActivate(context);
    if (!rolesValid) {
      throw new UnauthorizedException('Insufficient role permissions');
    }

    return true;
  }

  private async getClientRoleId() {
    return await this.roleService.findByName('client');
  }
}
