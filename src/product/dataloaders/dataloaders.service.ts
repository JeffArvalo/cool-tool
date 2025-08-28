import { Injectable, Scope } from '@nestjs/common';
import { VendorDataLoader } from './vendor.dataloader';
import { ImageDataLoader } from './image.dataloader';
import { CategoryDataLoader } from './category.dataloader';

@Injectable({ scope: Scope.REQUEST })
export class DataLoadersService {
  public readonly vendorLoader: ReturnType<VendorDataLoader['createLoader']>;
  public readonly imageLoader: ReturnType<ImageDataLoader['createLoader']>;
  public readonly categoryLoader: ReturnType<
    CategoryDataLoader['createLoader']
  >;

  constructor(
    private readonly vendorLoaderFactory: VendorDataLoader,
    private readonly imageLoaderFactory: ImageDataLoader,
    private readonly categoryLoaderFactory: CategoryDataLoader,
  ) {
    this.vendorLoader = this.vendorLoaderFactory.createLoader();
    this.imageLoader = this.imageLoaderFactory.createLoader();
    this.categoryLoader = this.categoryLoaderFactory.createLoader();
  }
}
