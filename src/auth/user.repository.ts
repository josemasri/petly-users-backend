import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(registerDto: RegisterDto): Promise<User> {
    const { email, username, password, city, country } = registerDto;

    const user = new User();

    user.email = email;
    user.username = username;
    user.city = city;
    user.country = country;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.createdAt = new Date();
    try {
      await user.save();
      user.password = '';
      user.password = undefined;
      user.password = null;
      return user;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // Duplicate email
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;
    const user = await this.findOne({ email });
    if (user && (await user.validatePassword(password))) {
      return user;
    }
    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
