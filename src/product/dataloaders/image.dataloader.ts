import DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { ImageService } from 'src/image/image.service';
import { Image } from 'src/image/image.model';

@Injectable({ scope: Scope.REQUEST })
export class ImageDataLoader {
  constructor(private imageService: ImageService) {}

  createLoader() {
    return new DataLoader<string, Image[]>(
      async (productIds: readonly string[]) => {
        const images = await this.imageService.findManyByProductIds(
          productIds as string[],
        );
        const imageMap = new Map<string, Image[]>();
        for (const image of images) {
          if (!imageMap.has(image.productId)) {
            imageMap.set(image.productId, []);
          }
          imageMap.get(image.productId)!.push(image);
        }
        return productIds.map((id) => imageMap.get(id) || []);
      },
    );
  }
}
