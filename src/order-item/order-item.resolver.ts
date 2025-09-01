import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { Product } from 'src/product/entities/product.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductDataLoader } from 'src/common/dataloaders/product.dataloader';

@Resolver(() => OrderItem)
export class OrderItemResolver {
  constructor(private readonly productDataLoader: ProductDataLoader) {}

  @ResolveField(() => Product, { nullable: true })
  async product(@Parent() orderItem: OrderItem): Promise<Product | null> {
    return this.productDataLoader.load(orderItem.productId);
  }
}
