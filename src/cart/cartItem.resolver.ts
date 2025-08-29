import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { CartItem } from './entities/cartItem.entity';
import { ProductDataLoader } from '../common/dataloaders/product.dataloader';
import { Product } from 'src/product/product.model';

@Resolver(() => CartItem)
export class CartItemResolver {
  constructor(private readonly productDataLoader: ProductDataLoader) {}

  @ResolveField(() => Product, { nullable: true })
  async product(@Parent() cartItem: CartItem): Promise<Product | null> {
    return this.productDataLoader.load(cartItem.productId);
  }
}
