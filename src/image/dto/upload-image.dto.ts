import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
@InputType()
export class UploadImageByProductInput {
  @Field(() => ID)
  @IsUUID()
  readonly productId: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  readonly path: string;

  @Field(() => Boolean)
  readonly mainImage: boolean;

  @Field(() => String, { nullable: true })
  readonly title?: string | null;
}
