import { Injectable } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { Prisma, OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetOrderInput } from './dto/get-order.input';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderInput: CreateOrderInput, userId: string) {
    const { paymentId, subtotalAmount, totalAmount, orderItems } =
      createOrderInput;

    console.log(createOrderInput);

    console.log(userId);

    return await this.prisma.$transaction(async (prisma) => {
      const order = await prisma.order.create({
        data: {
          userId,
          status: OrderStatus.Pending,
          paymentId,
          totalAmount,
          subtotalAmount,
        },
      });
      console.log(order);

      await prisma.orderItem.createMany({
        data: orderItems.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      return order;
    });
  }

  async findAll(filter?: Prisma.OrderWhereInput) {
    return await this.prisma.order.findMany({
      where: filter,
    });
  }

  async findOne(getOrderInput: GetOrderInput) {
    return await this.prisma.order.findUnique({
      where: { id: getOrderInput.id },
    });
  }

  async update(updateOrderInput: UpdateOrderInput) {
    return await this.prisma.order.update({
      where: { id: updateOrderInput.id },
      data: updateOrderInput,
    });
  }
}
