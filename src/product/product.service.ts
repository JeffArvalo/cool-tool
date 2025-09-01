import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ProductConnection,
  ProductsPaginationInput,
  SearchProductInput,
} from './dto/connection-product';
import { CreateProductInput } from './dto/create-product.dto';
import { UpdateProductInput } from './dto/update-product.dto';
import { DeleteProductInput } from './dto/delete-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts(
    productsPaginationInput: ProductsPaginationInput,
  ): Promise<ProductConnection> {
    const { limit, cursor, where } = productsPaginationInput;
    const filter = where ? { ...where } : {};

    const items = await this.prisma.product.findMany({
      where: filter,
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: 'asc' },
    });

    let nextCursor: string | undefined = undefined;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem?.id;
    }

    return { items, nextCursor };
  }

  async findManyByIds(ids: string[]): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { id: { in: ids } },
    });
  }

  async getProduct(data: SearchProductInput): Promise<Product | null> {
    return await this.prisma.product.findUnique({
      where: { id: data.id },
    });
  }

  async findManyByCategoryId(data: SearchProductInput) {
    const productCategories = await this.prisma.productCategories.findMany({
      where: { categoryId: data.id },
      include: { product: true },
    });

    const products: Product[] = [];

    productCategories.forEach((productCategory) => {
      products.push(productCategory.product);
    });

    return products;
  }

  async createProduct(data: CreateProductInput): Promise<Product> {
    const { storeId, quantity, ...productData } = data;
    return this.prisma.$transaction(async (prisma) => {
      const product = await prisma.product.create({ data: productData });
      await prisma.inventory.create({
        data: {
          productId: product.id,
          storeId,
          quantity,
        },
      });
      return product;
    });
  }

  async updateProduct(data: UpdateProductInput): Promise<Product> {
    const { storeId, quantity, ...productData } = data;

    const updatedProduct = await this.prisma.product.update({
      where: { id: productData.id },
      data: productData,
    });
    if (storeId && quantity) {
      await this.prisma.inventory.upsert({
        where: {
          storeId_productId: {
            productId: updatedProduct.id,
            storeId,
          },
        },
        update: { quantity },
        create: {
          productId: updatedProduct.id,
          storeId,
          quantity,
        },
      });
    }

    return updatedProduct;
  }

  async changeStateProduct(
    data: UpdateProductInput,
    state: boolean,
  ): Promise<Product> {
    return this.prisma.product.update({
      where: { id: data.id },
      data: { isEnable: state },
    });
  }

  async deleteProduct(data: DeleteProductInput): Promise<Product> {
    return this.prisma.product.delete({ where: { id: data.id } });
  }
}
