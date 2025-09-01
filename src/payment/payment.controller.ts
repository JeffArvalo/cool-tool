import {
  Body,
  Controller,
  Post,
  Req,
  Headers,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Stripe } from 'stripe';
import type { Request as RequestType } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/strategies/types/current-user';

@Controller('')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async createCheckoutSession(@Req() req: RequestType) {
    return this.paymentService.createCheckoutSession(req.user as CurrentUser);
  }

  @Post('payment/webhook')
  async handleStripeWebhook(
    @Req() req: RequestType,
    @Headers('stripe-signature') sig: string,
  ) {
    await this.paymentService.handleWebhook(req.body as Stripe.Event, sig);
  }
}
