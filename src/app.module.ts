import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleService } from './role/role.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ProductModule } from './product/product.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { VendorService } from './vendor/vendor.service';
import { ImageResolver } from './image/image.resolver';
import { ImageService } from './image/image.service';
import { CategoryService } from './category/category.service';
import { CartService } from './cart/cart.service';
import { CartModule } from './cart/cart.module';
import { ProductService } from './product/product.service';
import { PaymentModule } from './payment/payment.module';
import { PaymentService } from './payment/payment.service';
import { OrderModule } from './order/order.module';
import { OrderItemService } from './order-item/order-item.service';
import { OrderItemResolver } from './order-item/order-item.resolver';
import { OrderItemModule } from './order-item/order-item.module';
import { ProductDataLoader } from './common/dataloaders/product.dataloader';
import { GraphQLUpload } from 'graphql-upload-ts';
import { CloudinaryResolver } from './cloudinary/cloudinary.resolver';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { RedisModule } from './redis/redis.module';
import { ProductLikeModule } from './product-like/product-like.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.stagging', '.env.production'],
      validationSchema: Joi.object({
        ENV_MODE: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.number().port().default(3000),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().default('15m'),
        STRIPE_SECRET_KEY: Joi.string().required(),
        WEB_HOOK_SECRET: Joi.string().required(),
        STRIPE_API_KEY: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().port().default(6379),
        REDIS_PASSWORD: Joi.string().optional(),
        REDIS_USERNAME: Joi.string().default('default'),
        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),
      }),
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 30000,
          limit: 3,
        },
      ],
    }),
    RedisModule,
    UserModule,
    PrismaModule,
    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      buildSchemaOptions: {
        scalarsMap: [{ type: Object, scalar: GraphQLUpload }],
      },
    }),
    ProductModule,
    CartModule,
    PaymentModule.forRootAsync(),
    OrderModule,
    OrderItemModule,
    RedisModule,
    ProductLikeModule,
  ],
  controllers: [],
  providers: [
    PrismaService,
    RoleService,
    VendorService,
    ImageService,
    ImageResolver,
    CategoryService,
    CartService,
    ProductService,
    PaymentService,
    OrderItemService,
    OrderItemResolver,
    ProductDataLoader,
    CloudinaryResolver,
    CloudinaryService,
  ],
})
export class AppModule {}
