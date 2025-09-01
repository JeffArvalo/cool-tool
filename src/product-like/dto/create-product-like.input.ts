import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class CreateProductLikeInput {
  @Field(() => ID)
  @IsUUID()
  readonly productId: string;

  @Field(() => ID)
  @IsUUID()
  readonly storeId: string;
}
