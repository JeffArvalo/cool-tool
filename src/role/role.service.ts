import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async findByName(name: string) {
    try {
      return this.prisma.role.findUnique({ where: { name } });
    } catch (e) {
      throw e;  
    }
  }

  async findById(id: string) {
    try {
      return this.prisma.role.findUnique({ where: { id } });
    } catch (e) {
      throw e;
    }
  }
}
