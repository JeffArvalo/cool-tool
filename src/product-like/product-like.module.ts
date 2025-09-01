import { Module } from '@nestjs/common';
import { ProductLikeService } from './product-like.service';
import { ProductLikeResolver } from './product-like.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [ProductLikeResolver, ProductLikeService],
  imports: [PrismaModule],
})
export class ProductLikeModule {}
