import { Injectable } from '@nestjs/common';
import { Vendor } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  async findByName(name: string) {
    return this.prisma.vendor.findUnique({ where: { name } });
  }

  async findById(id: string) {
    return this.prisma.vendor.findUnique({ where: { id } });
  }

  async findManyByIds(ids: string[]): Promise<Vendor[]> {
    return this.prisma.vendor.findMany({
      where: { id: { in: ids } },
    });
  }
}
