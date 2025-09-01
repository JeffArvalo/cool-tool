import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateProductInput } from './create-product.dto';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @Field(() => ID)
  @IsUUID()
  readonly id: string;
}

@InputType()
export class ChangeStateProductInput {
  @Field(() => ID)
  @IsUUID()
  readonly id: string;
}
