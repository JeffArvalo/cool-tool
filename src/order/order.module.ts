import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { OrderItemResolver } from 'src/order-item/order-item.resolver';
import { ProductDataLoader } from 'src/common/dataloaders/product.dataloader';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductService } from 'src/product/product.service';
import { OrderItemService } from 'src/order-item/order-item.service';

@Module({
  providers: [
    OrderResolver,
    OrderService,
    OrderItemResolver,
    ProductDataLoader,
    ProductService,
    OrderItemService,
  ],
  imports: [PrismaModule],
  exports: [OrderService],
})
export class OrderModule {}
