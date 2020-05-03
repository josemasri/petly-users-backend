import { EntityRepository, Repository } from 'typeorm';
import { Pet } from './pet.entity';
import { AddPetDto } from './dto/add-pet.dto';
import { User } from 'src/auth/user.entity';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@EntityRepository(Pet)
export class PetRepository extends Repository<Pet> {
  async addPet(addPetDto: AddPetDto, user: User): Promise<Pet> {
    const { animal, description, name, age } = addPetDto;
    const pet = new Pet();
    pet.animal = animal;
    pet.desctiption = description;
    pet.name = name;
    pet.age = Number(age);
    pet.user = user;
    try {
      await pet.save();
      delete pet.user;
      return pet;
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async getAvailablePets(userId: number): Promise<Pet[]> {
    try {
      const query = this.createQueryBuilder('pet');
      query.where('pet.userId != :userId', { userId });
      return await query.execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getMyPets(userId: number): Promise<Pet[]> {
    try {
      return this.find({ userId });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deletePet(id: number, user: User): Promise<void> {
    try {
      const result = await this.delete({ id: id, userId: user.id });
      if (result.affected == 0) {
        throw new NotFoundException('Pet not found');
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updatePet(
    id: number,
    userId: number,
    addPetDto: AddPetDto,
  ): Promise<void> {
    const result = await this.update({ id, userId }, addPetDto);
    if (result.affected == 0) {
      throw new NotFoundException('Pet not found');
    }
  }
}
