import {
  Field,
  Float,
  ID,
  InputType,
  Int,
  ObjectType,
  PartialType,
} from '@nestjs/graphql';
import { Product } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsBoolean,
  IsUUID,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { Product as ProductField } from '../product.model';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly specification?: string;

  @Field(() => Float)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Only use 2 decimals' })
  @Min(0.01, { message: 'Price must be greater than 0' })
  readonly price: number;

  @Field(() => Int)
  @IsInt()
  readonly code: number;

  @Field(() => Boolean)
  @IsBoolean()
  readonly isEnable: boolean;

  @Field(() => ID)
  @IsUUID()
  readonly vendorId: string;

  @Field(() => ID)
  @IsUUID()
  readonly storeId: string;

  @Field(() => Int)
  @Min(1, { message: 'Quantity must be greater than 0' })
  @IsInt()
  readonly quantity: number;
}

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @Field(() => ID)
  @IsUUID()
  readonly id: string;
}

@InputType()
export class DeleteProductInput {
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
