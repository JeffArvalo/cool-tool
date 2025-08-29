import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class GetAllOrdersByClientInput {
  @Field(() => ID)
  @IsUUID()
  readonly userId: string;
}

@InputType()
export class GetOrderInput {
  @Field(() => ID)
  @IsUUID()
  readonly id: string;
}
