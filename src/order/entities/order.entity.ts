import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { OrderItem } from 'src/order-item/entities/order-item.entity';

@ObjectType()
export class Order {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  userId?: string | null;

  @Field(() => String)
  status: string;

  @Field(() => ID, { nullable: true })
  payment?: string | null;

  @Field(() => Float)
  totalAmount: number;

  @Field(() => Float)
  subtotalAmount: number;

  @Field(() => ID, { nullable: true })
  addressId?: string | null;

  @Field(() => [OrderItem])
  orderItems: OrderItem[];
}
