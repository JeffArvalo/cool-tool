import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ProductLikeService } from './product-like.service';
import { ProductLike } from './entities/product-like.entity';
import { CreateProductLikeInput } from './dto/create-product-like.input';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { IdProductLikeInput } from './dto/id-product-like.input';

@Resolver(() => ProductLike)
export class ProductLikeResolver {
  constructor(private readonly productLikeService: ProductLikeService) {}

  @Roles('client')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => ProductLike)
  createProductLike(
    @Args('createProductLikeInput')
    createProductLikeInput: CreateProductLikeInput,
    @Context() ctx: any,
  ) {
    return this.productLikeService.create(
      createProductLikeInput,
      ctx.req.user.id,
    );
  }

  @Roles('client')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [ProductLike], { name: 'productsLikeByClient' })
  findAll(@Context() ctx: any) {
    return this.productLikeService.findAll(ctx.req.user.id);
  }

  @Roles('client')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => ProductLike, { name: 'productLikeById' })
  findOne(
    @Args('idProductLikeInput') idProductLikeInput: IdProductLikeInput,
    @Context() ctx: any,
  ) {
    return this.productLikeService.findOne(idProductLikeInput, ctx.req.user.id);
  }

  @Roles('client')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => ProductLike)
  removeProductLike(
    @Args('idProductLikeInput') idProductLikeInput: IdProductLikeInput,
    @Context() ctx: any,
  ) {
    return this.productLikeService.remove(idProductLikeInput, ctx.req.user.id);
  }
}
