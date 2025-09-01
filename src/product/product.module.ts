import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { VendorService } from 'src/vendor/vendor.service';
import { DataLoadersService } from '../common/dataloaders/dataloaders.service';
import { VendorDataLoader } from '../common/dataloaders/vendor.dataloader';
import { ImageDataLoader } from '../common/dataloaders/image.dataloader';
import { ImageService } from 'src/image/image.service';
import { CategoryDataLoader } from '../common/dataloaders/category.dataloader';
import { CategoryService } from 'src/category/category.service';

@Module({
  providers: [
    ProductService,
    ProductResolver,
    VendorService,
    ImageService,
    CategoryService,
    DataLoadersService,
    VendorDataLoader,
    ImageDataLoader,
    CategoryDataLoader,
  ],
  imports: [PrismaModule],
})
export class ProductModule {}
