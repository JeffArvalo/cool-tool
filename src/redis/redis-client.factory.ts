import { BadGatewayException, FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

export const redisClientFactory: FactoryProvider = {
  provide: REDIS_CLIENT,
  useFactory: async (configService: ConfigService) => {
    const client = createClient({
      username: configService.get<string>('REDIS_USERNAME'),
      password: configService.get<string>('REDIS_PASSWORD'),
      socket: {
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
      },
    });

    client.on('error', (err) => {
      throw new BadGatewayException(`Redis Client Error ${err}`);
    });

    await client.connect();
    return client;
  },
  inject: [ConfigService],
};
