import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload-ts';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);

  app.useGlobalFilters(new AllExceptionsFilter());

  app.use(helmet());
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 5 }));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(configService.get<number>('PORT') ?? 3000);
}
bootstrap().catch((err) => {
  throw err;
});
