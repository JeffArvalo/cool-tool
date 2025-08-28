import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class RemoveCartInput {
  @Field(() => ID)
  @IsUUID()
  productId: string;
}
