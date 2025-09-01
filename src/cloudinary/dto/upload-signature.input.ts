import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UploadSignatureInput {
  @Field({ nullable: true })
  folder?: string;

  @Field({ nullable: true })
  source?: string;
}
