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
    const { animal, description, name, age, imageUrl } = addPetDto;
    const pet = new Pet();
    pet.animal = animal;
    pet.description = description;
    pet.name = name;
    pet.age = Number(age);
    pet.user = user;
    pet.imageUrl = imageUrl;
    try {
      await pet.save();
      delete pet.user;
      return pet;
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async getAvailablePets(userId: number, pageNumber: number): Promise<Pet[]> {
    try {
      const query = this.createQueryBuilder('pet');
      query.select('pet.id', 'id');
      query.addSelect('pet.animal', 'animal');
      query.addSelect('pet.name', 'name');
      query.addSelect('pet.age', 'age');
      query.addSelect('pet.imageUrl', 'imageUrl');
      query.addSelect('pet.description', 'description');
      query.addSelect('pet.createdAt', 'createdAt');
      query.addSelect('user.id', 'userId');
      query.addSelect('user.firstName', 'userFirstName');
      query.addSelect('user.lastName', 'userLastName');
      query.addSelect('user.country', 'userCountry');
      query.addSelect('user.state', 'userState');
      query.addSelect('user.county', 'userCounty');
      query.addSelect('user.createdAt', 'userCreatedAt');
      query.where('pet.userId != :userId', { userId });
      query.andWhere('pet.available = :available', {available: true})
      query.leftJoin('pet.user', 'user');
      query.skip((pageNumber - 1) * 20);
      query.limit(20);
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
