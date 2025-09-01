import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CloudinaryResponseBody {
  @Field(() => String)
  signature: string;

  @Field(() => Int)
  timestamp: number;

  @Field(() => String)
  api_key: string;

  @Field(() => String, { nullable: true })
  folder?: string | null;
}

@ObjectType()
export class CloudinaryResponse {
  @Field(() => String)
  url: string;

  @Field(() => CloudinaryResponseBody)
  cloudinary_body: CloudinaryResponseBody;
}
