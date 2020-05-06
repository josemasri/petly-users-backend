import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { PetRepository } from './pet.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';

import { AddPetDto } from './dto/add-pet.dto';
import { Pet } from './pet.entity';
import { deleteFile, deleteFileCloudinary } from 'src/utils/utils';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(PetRepository)
    private petRepository: PetRepository,
  ) {}
  async addPet(addPetDto: AddPetDto, user: User): Promise<Pet> {
    return await this.petRepository.addPet(addPetDto, user);
  }

  async getAvailablePets(userId: number, pageNumber: number): Promise<Pet[]> {
    return await this.petRepository.getAvailablePets(userId, pageNumber);
  }

  async getMyPets(userId: number): Promise<Pet[]> {
    return await this.petRepository.getMyPets(userId);
  }

  async deletePet(id: number, user: User) {
    const pet = await this.petRepository.findOne(id);
    await deleteFileCloudinary(pet.imageUrl);
    await this.petRepository.deletePet(id, user);
  }

  async updatePet(id: number, user: User, addPetDto: AddPetDto) {
    await this.petRepository.updatePet(id, user.id, addPetDto);
  }

  async updatePetStatus(
    id: number,
    status: boolean,
    user: User,
  ): Promise<void> {
    const res = await this.petRepository.update(
      { id, userId: user.id },
      { available: status },
    );
    if (res.affected == 0) {
      throw new NotFoundException('Pet not found');
    }
  }
}
