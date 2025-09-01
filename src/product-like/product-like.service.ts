import { Injectable } from '@nestjs/common';
import { CreateProductLikeInput } from './dto/create-product-like.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { IdProductLikeInput } from './dto/id-product-like.input';

@Injectable()
export class ProductLikeService {
  constructor(private prisma: PrismaService) {}

  async create(createProductLikeInput: CreateProductLikeInput, userId: string) {
    const inventory = await this.prisma.inventory.findFirstOrThrow({
      where: {
        productId: createProductLikeInput.productId,
        storeId: createProductLikeInput.storeId,
      },
    });
    return this.prisma.productLike.create({
      data: {
        userId,
        inventoryId: inventory.id,
      },
    });
  }

  async findAll(userId: string) {
    return await this.prisma.productLike.findMany({
      where: {
        userId,
      },
      include: {
        inventory: true,
      },
    });
  }

  async findOne(idProductLikeInput: IdProductLikeInput, userId: string) {
    return await this.prisma.productLike.findFirst({
      where: {
        id: idProductLikeInput.id,
        userId,
      },
    });
  }

  async remove(idProductLikeInput: IdProductLikeInput, userId: string) {
    return await this.prisma.productLike.delete({
      where: {
        id: idProductLikeInput.id,
        userId,
      },
    });
  }
}
