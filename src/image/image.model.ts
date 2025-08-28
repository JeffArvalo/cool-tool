import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Image {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field()
  productId: string;

  @Field(() => Boolean)
  mainImage: boolean;

  @Field(() => String, { nullable: true })
  title?: string | null;

  @Field()
  path: string;
}
