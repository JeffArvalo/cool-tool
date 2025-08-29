import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CartItem } from './cartItem.entity';

@ObjectType()
export class Cart {
  @Field(() => ID)
  id: string;

  @Field(() => [CartItem])
  cartItems: CartItem[];
}

@ObjectType()
export class CartItemStatus {
  @Field(() => String)
  status: string;

  @Field(() => String)
  message: string;
}
