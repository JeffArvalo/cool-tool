import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async findByName(name: string) {
    return this.prisma.role.findUnique({ where: { name } });
  }

  async findById(id: string) {
    return this.prisma.role.findUnique({ where: { id } });
  }
}
