import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoleService } from 'src/role/role.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';

@Module({
  providers: [UserService, RoleService, JwtAuthGuard, RolesGuard],
  controllers: [UserController],
  imports: [PrismaModule],
})
export class UserModule {}
