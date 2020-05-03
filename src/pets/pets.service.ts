import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { PetRepository } from './pet.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';

import { AddPetDto } from './dto/add-pet.dto';
import { Pet } from './pet.entity';
import { deleteFile } from 'src/utils/utils';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(PetRepository)
    private petRepository: PetRepository,
  ) {}
  async addPet(addPetDto: AddPetDto, user: User): Promise<Pet> {
    return await this.petRepository.addPet(addPetDto, user);
  }

  async getAvailablePets(userId: number): Promise<Pet[]> {
    return await this.petRepository.getAvailablePets(userId);
  }

  async getMyPets(userId: number): Promise<Pet[]> {
    return await this.petRepository.getMyPets(userId);
  }

  async deletePet(id: number, user: User) {
    // Delete pet image
    const pet = await this.petRepository.findOne(id);
    const imagePath = join(
      __dirname,
      '..',
      'public',
      'images',
      'pets',
      pet.imageUrl,
    );
    console.log(imagePath);
    deleteFile(imagePath);
    await this.petRepository.deletePet(id, user);
  }

  async updatePet(id: number, user: User, addPetDto: AddPetDto) {
    await this.petRepository.updatePet(id, user.id, addPetDto);
  }
}
