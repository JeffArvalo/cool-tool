import { Injectable } from '@nestjs/common';
import { Image } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.image.findUnique({ where: { id } });
  }

  async findManyByProductIds(ids: string[]): Promise<Image[]> {
    return this.prisma.image.findMany({
      where: { productId: { in: ids } },
    });
  }
}
