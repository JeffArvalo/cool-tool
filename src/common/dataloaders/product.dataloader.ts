import DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { ProductService } from '../../product/product.service';
import { Product } from 'src/product/entities/product.entity';

@Injectable({ scope: Scope.REQUEST })
export class ProductDataLoader {
  private readonly loader: DataLoader<string, Product | null>;

  constructor(private readonly productService: ProductService) {
    this.loader = new DataLoader<string, Product | null>(async (productIds) => {
      const products = await this.productService.findManyByIds([...productIds]);
      const productMap = new Map(products.map((p) => [p.id, p]));
      return productIds.map((id) => productMap.get(id) || null);
    });
  }

  load(productId: string) {
    return this.loader.load(productId);
  }
}
