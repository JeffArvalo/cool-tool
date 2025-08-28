import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Category } from 'src/category/category.model';
import { Image } from 'src/image/image.model';
import { Vendor } from 'src/vendor/vendor.model';

@ObjectType()
export class Product {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => String, { nullable: true })
  specification?: string | null;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  code: number;

  @Field()
  isEnable: boolean;

  @Field()
  vendorId: string;

  @Field(() => [Category], { nullable: true })
  categories?: [Category];

  @Field(() => [Image], { nullable: true })
  images?: [Image];

  @Field(() => Vendor, { nullable: true })
  vendor?: Vendor;

  @Field({ nullable: true })
  createdAt: Date;
}
