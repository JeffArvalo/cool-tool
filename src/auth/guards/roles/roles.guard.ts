import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { Observable } from 'rxjs';
import type { Request } from 'express';
import { ROLES_KEY } from 'src/auth/decorator/roles.decorator';
import { CurrentUser } from 'src/auth/strategies/types/current-user';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role['name'][]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    let user: CurrentUser;

    if (context.getType<'graphql'>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context).getContext();
      user = gqlContext.req?.user;
    } else {
      const httpContext = context.switchToHttp().getRequest<Request>();
      user = httpContext.user as CurrentUser;
    }
    const hasRequiredRole = requiredRoles.some((role) => user.role === role);
    return hasRequiredRole;
  }
}
