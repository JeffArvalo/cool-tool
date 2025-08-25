import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleService } from './role/role.service';

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
    UserModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [],
  providers: [PrismaService, RoleService],
})
export class AppModule {}
