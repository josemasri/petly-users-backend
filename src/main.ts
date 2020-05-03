import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as morgan from 'morgan';
import * as cors from 'cors';

import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  process.env.TZ = 'America/Mexico_City';
  const app = await NestFactory.create(AppModule);
  app.use(morgan('dev'));
  app.use(cors());
  const logger: Logger = new Logger('Main');

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Petly API')
    .setDescription('The REST API for Petly User App')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
