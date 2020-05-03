import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { PetRepository } from './pet.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PetRepository]),
    AuthModule,
    MulterModule.register({
      dest: './public/uploads',
    }),
  ],
  controllers: [PetsController],
  providers: [PetsService],
})
export class PetsModule {}
