import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Vendor {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field()
  name: string;
}
