// cloudinary.resolver.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CloudinaryService } from './cloudinary.service';
import { UploadSignatureInput } from './dto/upload-signature.input';
import { CloudinaryResponse } from './entities/cloudinary.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Resolver()
export class CloudinaryResolver {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Roles('manager')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => CloudinaryResponse)
  async generateCloudinaryUploadSignature(
    @Args('input') input: UploadSignatureInput,
  ): Promise<CloudinaryResponse> {
    return await this.cloudinaryService.generateUploadSignature(input);
  }
}
