import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderItemService {
  constructor(private prisma: PrismaService) {}

  async findOrderItemsByOrderId(orderId: string) {
    return await this.prisma.orderItem.findMany({ where: { orderId } });
  }
}
