import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(registerDto: RegisterDto): Promise<User> {
    const { email, firstName, lastName, password, state, country, county } = registerDto;

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.state = state;
    user.country = country;
    user.county = county;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.createdAt = new Date();
    try {
      await user.save();
      delete user.password;
      delete user.salt;
      return user;
    } catch (error) {
      if (error.code === '23505') {
        // Duplicate email
        throw new ConflictException('Email already exists');
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;
    const user = await this.findOne({ email });
    if (user && (await user.validatePassword(password))) {
      delete user.password;
      delete user.salt;
      return user;
    }
    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.findOne({ email });
      if (!user) {
        throw new UnauthorizedException('Invalid Token');
      }
      delete user.password;
      delete user.salt;
      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
