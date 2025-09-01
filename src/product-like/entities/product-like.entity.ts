import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class ProductLike {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  userId: string;

  @Field(() => ID, { nullable: true })
  inventoryId: string;

  @Field(() => Date, { nullable: true })
  likedAt: Date;
}
