import { Field, Float, ID, InputType, Int } from '@nestjs/graphql';
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
