import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { id } });
  }

  async findManyByProductIds(ids: string[]) {
    return this.prisma.productCategories.findMany({
      where: { productId: { in: ids } },
      include: { category: true },
    });
  }
}
