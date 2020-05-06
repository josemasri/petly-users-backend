import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmConfig } from './type-orm-config';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { PetsModule } from './pets/pets.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    ChatModule,
    PetsModule,
  ],
})
export class AppModule {}
