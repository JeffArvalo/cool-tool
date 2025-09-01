import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { Product } from 'src/product/entities/product.entity';

@ObjectType()
export class OrderItem {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field(() => Int, { nullable: true })
  quantity: number;

  @Field(() => Float, { nullable: true })
  price: number;

  @Field(() => ID, { nullable: true })
  productId: string;

  @Field(() => Product, { nullable: true })
  product?: Product;
}
