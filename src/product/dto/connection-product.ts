import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Product } from '@prisma/client';
import { IsInt, IsUUID, IsOptional } from 'class-validator';
import { Product as ProductField } from '../entities/product.entity';

@InputType()
export class SearchProductInput {
  @Field(() => ID)
  @IsUUID()
  readonly id: string;
}

@InputType()
export class ProductWhereInput {
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isEnable?: boolean;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  vendorId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string;
}

@InputType()
export class ProductsPaginationInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  readonly cursor?: string;

  @Field(() => Int, { defaultValue: 10 })
  @IsOptional()
  @IsInt()
  readonly limit: number;

  @Field(() => ProductWhereInput, { nullable: true })
  @IsOptional()
  readonly where?: ProductWhereInput;
}

@ObjectType()
export class ProductConnection {
  @Field(() => [ProductField])
  items: Product[];

  @Field(() => String, { nullable: true })
  nextCursor?: string;

  @Field(() => String, { nullable: true })
  prevCursor?: string;
}
