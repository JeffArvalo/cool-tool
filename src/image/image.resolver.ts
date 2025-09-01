import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Image } from './entities/image.entity';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { ImageService } from './image.service';
import { UploadImageByProductInput } from './dto/upload-image.dto';
import { GraphQLUpload } from 'graphql-upload-ts';
import type { FileUpload } from 'graphql-upload-ts';

@Resolver('image')
export class ImageResolver {
  constructor(private readonly imageService: ImageService) {}

  @Roles('manager')
  @Mutation(() => Image)
  @UseGuards(JwtAuthGuard, RolesGuard)
  uploadImageByProduct(
    @Args('uploadImageByProductInput')
    uploadImageByProductInput: UploadImageByProductInput,
  ) {
    return this.imageService.uploadImage(uploadImageByProductInput);
  }
}
