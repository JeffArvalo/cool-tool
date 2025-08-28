import {
  Resolver,
  Query,
  ResolveField,
  Parent,
  Mutation,
  Args,
} from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { Vendor } from 'src/vendor/vendor.model';
import { UseGuards, Scope, Injectable } from '@nestjs/common';
import {
  ChangeStateProductInput,
  CreateProductInput,
  DeleteProductInput,
  ProductConnection,
  ProductsPaginationInput,
  SearchProductInput,
  UpdateProductInput,
} from './dto/product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { DataLoadersService } from './dataloaders/dataloaders.service';
import { Image } from 'src/image/image.model';
import { Category } from 'src/category/category.model';

@Injectable({ scope: Scope.REQUEST })
@Resolver(Product)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly dataLoadersService: DataLoadersService,
  ) {}

  @Query(() => ProductConnection, { nullable: false })
  allProducts(
    @Args('ProductsPaginationInput')
    productsPaginationInput: ProductsPaginationInput,
  ) {
    return this.productService.getAllProducts(productsPaginationInput);
  }

  @Query(() => Product, { nullable: true })
  getProduct(@Args('getProductInput') getProductInput: SearchProductInput) {
    return this.productService.getProduct(getProductInput);
  }

  @Query(() => [Product], { nullable: false })
  getProductsByCategory(
    @Args('getProductsByCategoryInput')
    getProductByCategoryInput: SearchProductInput,
  ) {
    return this.productService.findManyByCategoryId(getProductByCategoryInput);
  }

  @Roles('manager')
  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    return this.productService.createProduct(createProductInput);
  }

  @Roles('manager')
  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productService.updateProduct(updateProductInput);
  }

  @Roles('manager')
  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteProduct(
    @Args('deleteProductInput') deleteProductInput: DeleteProductInput,
  ) {
    return this.productService.deleteProduct(deleteProductInput);
  }

  @Roles('manager')
  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard, RolesGuard)
  disableProduct(
    @Args('disableProductInput') disableProductInput: ChangeStateProductInput,
  ) {
    return this.productService.changeStateProduct(disableProductInput, false);
  }

  @Roles('manager')
  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard, RolesGuard)
  enableProduct(
    @Args('enableProductInput') enableProductInput: ChangeStateProductInput,
  ) {
    return this.productService.changeStateProduct(enableProductInput, true);
  }

  @ResolveField(() => [Image], { name: 'images', nullable: true })
  async getImages(@Parent() product: Product): Promise<Image[] | null> {
    return this.dataLoadersService.imageLoader.load(product.id);
  }

  @ResolveField(() => [Category], { name: 'categories', nullable: true })
  async getCategories(@Parent() product: Product): Promise<Category[] | null> {
    return this.dataLoadersService.categoryLoader.load(product.id);
  }

  @ResolveField(() => Vendor, { name: 'vendor', nullable: true })
  async getVendor(@Parent() product: Product): Promise<Vendor | null> {
    return this.dataLoadersService.vendorLoader.load(product.vendorId);
  }
}
