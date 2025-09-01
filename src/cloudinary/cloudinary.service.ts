import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadSignatureInput } from './dto/upload-signature.input';
import { ConfigService } from '@nestjs/config';
import { CloudinaryResponse } from './entities/cloudinary.entity';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async generateUploadSignature(
    input: UploadSignatureInput,
  ): Promise<CloudinaryResponse> {
    const { folder, source } = input;
    const api_key = this.configService.get<string>('CLOUDINARY_API_KEY')!;
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, source, folder },
      this.configService.get<string>('CLOUDINARY_API_SECRET')!,
    );
    return {
      url: `https://api.cloudinary.com/v1_1/${this.configService.get<string>('CLOUDINARY_CLOUD_NAME')}/upload`,
      cloudinary_body: { signature, timestamp, folder, api_key },
    };
  }
}
