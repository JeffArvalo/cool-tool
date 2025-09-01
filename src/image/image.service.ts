import { Injectable } from '@nestjs/common';
import { Image } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadImageByProductInput } from './dto/upload-image.dto';

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

  async uploadImage(uploadImageByProductInput: UploadImageByProductInput) {
    return this.prisma.image.create({
      data: uploadImageByProductInput,
    });
  }
}
