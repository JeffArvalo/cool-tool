import { DynamicModule, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrderModule } from 'src/order/order.module';
import { OrderService } from 'src/order/order.service';

@Module({
  providers: [PaymentService, PrismaService, OrderService],
  controllers: [PaymentController],
  imports: [ConfigModule, PrismaModule, OrderModule],
  exports: ['STRIPE_CLIENT', PaymentService],
})
export class PaymentModule {
  static forRootAsync(): DynamicModule {
    return {
      module: PaymentModule,
      imports: [ConfigModule],
      providers: [
        PaymentService,
        {
          provide: 'STRIPE_CLIENT',
          useFactory: (configService: ConfigService) => {
            const secretKey = configService.get<string>('STRIPE_SECRET_KEY')!;
            const webhookSecret = configService.get<string>(
              'STRIPE_WEBHOOK_SECRET',
            )!;
            const stripe = new Stripe(secretKey, {
              apiVersion: '2025-08-27.basil',
            });

            return { stripe, webhookSecret };
          },
          inject: [ConfigService],
        },
      ],
      exports: [PaymentService],
    };
  }
}
