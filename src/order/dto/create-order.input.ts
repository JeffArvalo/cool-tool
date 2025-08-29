import { InputType, Field, ID, Float } from '@nestjs/graphql';
import { IsNumber, IsUUID, Min } from 'class-validator';
import { CreateOrderItemInput } from 'src/order-item/dto/create-order-item.input';

@InputType()
export class CreateOrderInput {
  @Field(() => ID)
  @IsUUID()
  readonly paymentId: string;

  @Field(() => Float)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Only use 2 decimals' })
  @Min(0.01, { message: 'Price must be greater than 0' })
  readonly totalAmount: number;

  @Field(() => Float)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Only use 2 decimals' })
  @Min(0.01, { message: 'Price must be greater than 0' })
  readonly subtotalAmount: number;

  @Field(() => [CreateOrderItemInput])
  readonly orderItems: CreateOrderItemInput[];
}
