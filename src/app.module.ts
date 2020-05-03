import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

import { typeOrmConfig } from './type-orm-config';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { PetsModule } from './pets/pets.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, 'public'),
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    ChatModule,
    PetsModule,
  ],
})
export class AppModule {}
