import { Injectable } from '@nestjs/common';
import { AddToCartInput } from './dto/create-cart.input';
import { UpdateCartInput } from './dto/update-cart.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { RemoveCartInput } from './dto/remove-cart-item.input';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    return await this.prisma.cart.findUniqueOrThrow({
      where: { userId },
    });
  }

  async addToCart(addToCartInput: AddToCartInput, userId: string) {
    const { productId, quantity } = addToCartInput;
    await this.prisma.$transaction(async (prisma) => {
      const product = await this.prisma.product.findUniqueOrThrow({
        where: { id: productId },
      });

      const cart = await prisma.cart.upsert({
        where: {
          userId,
        },
        update: {},
        create: {
          userId,
        },
      });

      await prisma.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
        update: { quantity: quantity },
        create: {
          cartId: cart.id,
          productId: product.id,
          quantity: quantity,
          price: product.price,
        },
      });
    });
    return { status: 'Success', message: 'Item added to cart successfully' };
  }

  async updateCartItem(updateCartInput: UpdateCartInput, userId: string) {
    const { productId, quantity } = updateCartInput;
    await this.prisma.$transaction(async (prisma) => {
      const product = await this.prisma.product.findUniqueOrThrow({
        where: { id: productId },
      });

      const cart = await prisma.cart.findUniqueOrThrow({
        where: {
          userId,
        },
      });

      await prisma.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
        update: { quantity: quantity },
        create: {
          cartId: cart.id,
          productId: product.id,
          quantity: quantity,
          price: product.price,
        },
      });
    });
    return { status: 'Success', message: 'Item updated in cart successfully' };
  }

  async findCartItemsByCartId(cartId: string) {
    return await this.prisma.cartItem.findMany({ where: { cartId } });
  }

  async removeCartItem(removeCartItemInput: RemoveCartInput, userId: string) {
    const cart = await this.prisma.cart.findUniqueOrThrow({
      where: {
        userId,
      },
    });

    await this.prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: removeCartItemInput.productId,
        },
      },
    });
    return { status: 'Success', message: 'Item remove from cart successfully' };
  }
}
