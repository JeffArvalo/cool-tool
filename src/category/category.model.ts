import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Category {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description?: string | null;
}
