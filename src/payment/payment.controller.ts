import { Body, Controller, Post, Req, Headers, Inject } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Stripe } from 'stripe';
import type { Request as RequestType } from 'express';

@Controller('payment') // Define the base route for this controller
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    @Inject('STRIPE_CLIENT')
    private readonly stripeClient: { stripe: Stripe; webhookSecret: string },
  ) {}

  @Post('create-checkout-session') // Define the route for creating a checkout session
  async createCheckoutSession(
    @Body()
    body: {
      amount: number;
      currency: string;
      productId: string;
      quantity: number;
    },
  ): Promise<Stripe.Checkout.Session> {
    console.log(body);
    const { amount, currency, productId, quantity } = body; // Destructure the body to get the necessary parameters

    return this.paymentService.createCheckoutSession(
      amount,
      currency,
      productId,
      quantity,
    ); // Call the service method to create the session
  }

  @Post('webhook')
  async handleStripeWebhook(
    @Req() req: RequestType,
    @Headers('stripe-signature') sig: string,
  ) {
    console.log('active webhook');
    console.log(sig);
    const event: Stripe.Event = req.body;

    await this.paymentService.handleWebhook(event);
  }
}
