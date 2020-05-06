import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as morgan from 'morgan';
import * as cors from 'cors';
import * as config from 'config';

import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const serverConfig: any = config.get('server');

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

  const port = process.env.PORT || serverConfig.port;

  await app.listen(port);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
