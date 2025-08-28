import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsInt, IsUUID, Min } from 'class-validator';

@InputType()
export class AddToCartInput {
  @Field(() => ID)
  @IsUUID()
  readonly productId: string;

  @Field(() => Int)
  @Min(1, { message: 'Quantity must be greater than 0' })
  @IsInt()
  readonly quantity: number;
}
