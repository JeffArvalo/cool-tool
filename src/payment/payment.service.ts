import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { CurrentUser } from 'src/auth/strategies/types/current-user';
import { OrderService } from 'src/order/order.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Stripe } from 'stripe';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('STRIPE_CLIENT')
    private readonly stripeClient: { stripe: Stripe; webhookSecret: string },
    private readonly prisma: PrismaService,
    private readonly orderService: OrderService,
  ) {}

  async createCheckoutSession(user: CurrentUser) {
    return await this.prisma.$transaction(async (prisma) => {
      const cart = await prisma.cart.findUniqueOrThrow({
        where: {
          userId: user.id,
        },
      });

      const cartItems = await prisma.cartItem.findMany({
        where: {
          cartId: cart.id,
        },
        include: { product: true },
      });

      const line_items = cartItems.map((cartItem) => {
        return {
          price_data: {
            currency: 'USD',
            product_data: {
              name: cartItem.product.name,
            },
            unit_amount: cartItem.price * 100,
          },
          quantity: cartItem.quantity,
        };
      });

      const session = await this.stripeClient.stripe.checkout.sessions.create({
        line_items: line_items,
        mode: 'payment',
        success_url:
          'https://docs.web3forms.com/~gitbook/image?url=https%3A%2F%2F4078640192-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F-MPUC7SfrK7-rhtC1UKR%252Fuploads%252FMlps9UcrYoZJgiEsIOML%252FCleanShot%25202024-02-02%2520at%252013.16.55%25402x.png%3Falt%3Dmedia%26token%3Dab2200fb-28ca-4ca9-b71e-4aba34d87cb6&width=768&dpr=4&quality=100&sign=99b54896&sv=2',
        metadata: {
          userId: user.id,
        },
      });

      const payment = await prisma.payment.create({
        data: {
          amount: session.amount_total! / 100,
          currency: session.currency!,
          status: PaymentStatus.Pending,
          stripeId: session.id,
        },
      });

      const order = await prisma.order.create({
        data: {
          userId: user.id,
          status: OrderStatus.Pending,
          paymentId: payment.id,
          totalAmount: session.amount_total! / 100,
          subtotalAmount: session.amount_subtotal! / 100,
        },
      });

      await prisma.orderItem.createMany({
        data: cartItems.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      return session.url;
    });
  }

  async handleWebhook(event: Stripe.Event, sig: string) {
    switch (event.type) {
      case 'checkout.session.completed':
        const checkout = event.data.object;
        if (checkout.payment_status === 'paid') {
          return await this.prisma.$transaction(async (prisma) => {
            const payment = await prisma.payment.update({
              where: { stripeId: checkout.id },
              data: { status: PaymentStatus.Completed },
            });
            console.log(payment);
            const order = await prisma.order.update({
              where: { paymentId: payment.id },
              data: { status: OrderStatus.Completed },
            });
            console.log(order);
            return;
          });
        } else {
          throw new UnprocessableEntityException(
            'Payment status is not successful',
          );
        }
      default:
        console.warn(`Unhandled event type ${event.type}`);
        break;
    }
  }
}
