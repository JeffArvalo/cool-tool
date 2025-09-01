import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class IdProductLikeInput {
  @Field(() => ID)
  @IsUUID()
  readonly id: string;
}
