import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { Product } from 'src/product/product.model';
import { OrderItem } from './entities/orderItem.entity';
import { ProductDataLoader } from 'src/common/dataloaders/product.dataloader';

@Resolver(() => OrderItem)
export class OrderItemResolver {
  constructor(private readonly productDataLoader: ProductDataLoader) {}

  @ResolveField(() => Product, { nullable: true })
  async product(@Parent() orderItem: OrderItem): Promise<Product | null> {
    return this.productDataLoader.load(orderItem.productId);
  }
}
