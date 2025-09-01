import DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/category.model';

@Injectable({ scope: Scope.REQUEST })
export class CategoryDataLoader {
  constructor(private categoryService: CategoryService) {}

  createLoader() {
    return new DataLoader<string, Category[]>(
      async (productIds: readonly string[]) => {
        const categories = await this.categoryService.findManyByProductIds(
          productIds as string[],
        );
        const categoryMap = new Map<string, Category[]>();
        for (const category of categories) {
          if (!categoryMap.has(category.productId)) {
            categoryMap.set(category.productId, []);
          }
          categoryMap.get(category.productId)!.push(category.category);
        }
        return productIds.map((id) => categoryMap.get(id) || []);
      },
    );
  }
}
