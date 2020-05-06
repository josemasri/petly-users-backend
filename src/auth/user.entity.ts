import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
// Bcrypt for password encryption
import * as bcrypt from 'bcrypt';
import { Pet } from 'src/pets/pet.entity';

@Entity()
// Unique keys
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  country: string;
  @Column()
  state: string;
  @Column()
  county: string;
  @Column()
  password: string;
  @Column()
  salt: string;
  @Column()
  createdAt: Date;
  @OneToMany(
    () => Pet,
    pet => pet.user,
    { eager: false },
  )
  pets: Pet[];

  // Entity function
  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
