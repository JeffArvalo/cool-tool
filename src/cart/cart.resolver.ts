import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart, CartItemStatus } from './entities/cart.entity';
import { AddToCartInput } from './dto/create-cart.input';
import { UpdateCartInput } from './dto/update-cart.input';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { CartItem } from './entities/cartItem.entity';
import { RemoveCartInput } from './dto/remove-cart-item.input';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Roles('client')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => Cart)
  async getCart(@Context() ctx: any) {
    return await this.cartService.getCart(ctx.req.user.id);
  }

  @Roles('client')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => CartItemStatus)
  async addToCart(
    @Args('addToCartInput') addToCartInput: AddToCartInput,
    @Context() ctx: any,
  ) {
    return await this.cartService.addToCart(addToCartInput, ctx.req.user.id);
  }

  @Roles('client')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => CartItemStatus)
  async updateCart(
    @Args('updateToCartInput') updateCartInput: UpdateCartInput,
    @Context() ctx: any,
  ) {
    return await this.cartService.updateCartItem(
      updateCartInput,
      ctx.req.user.id,
    );
  }

  @Roles('client')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => CartItemStatus)
  async removeCartItem(
    @Args('removeCartItemInput') removeCartItemInput: RemoveCartInput,
    @Context() ctx: any,
  ) {
    return await this.cartService.removeCartItem(
      removeCartItemInput,
      ctx.req.user.id,
    );
  }

  @ResolveField(() => [CartItem])
  async cartItems(@Parent() cart: Cart) {
    return await this.cartService.findCartItemsByCartId(cart.id);
  }
}
