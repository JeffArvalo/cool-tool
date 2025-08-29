import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductService } from 'src/product/product.service';
import { ProductDataLoader } from '../common/dataloaders/product.dataloader';
import { CartItemResolver } from './cartItem.resolver';

@Module({
  providers: [
    CartResolver,
    CartService,
    CartItemResolver,
    ProductService,
    ProductDataLoader,
  ],
  imports: [PrismaModule],
})
export class CartModule {}
