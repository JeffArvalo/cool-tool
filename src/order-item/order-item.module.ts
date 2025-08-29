import { Module } from '@nestjs/common';
import { ProductDataLoader } from 'src/common/dataloaders/product.dataloader';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductService } from 'src/product/product.service';
import { OrderItemResolver } from './order-item.resolver';
import { OrderItemService } from './order-item.service';

@Module({
  providers: [
    OrderItemService,
    ProductDataLoader,
    OrderItemResolver,
    ProductService,
  ],
  imports: [PrismaModule],
})
export class OrderItemModule {}
