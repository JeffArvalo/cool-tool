import { InputType, Field, ID, Int, Float } from '@nestjs/graphql';
import { IsInt, IsNumber, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateOrderItemInput {
  @Field(() => ID)
  @IsUUID()
  readonly productId: string;

  @Field(() => Int)
  @Min(1, { message: 'Quantity must be greater than 0' })
  @IsInt()
  readonly quantity: number;

  @Field(() => Float)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Only use 2 decimals' })
  @Min(0.01, { message: 'Price must be greater than 0' })
  readonly price: number;
}
