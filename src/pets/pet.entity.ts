import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/auth/user.entity';

@Entity()
// Unique keys
export class Pet extends BaseEntity {
  constructor() {
    super();
  }

  @PrimaryGeneratedColumn() id: number;
  @Column() animal: string;
  @Column() name: string;
  @Column() age: number;
  @Column() imageUrl: string;
  @Column('text') desctiption: string;
  @Column({ default: true }) available: boolean;
  @ManyToOne(
    () => User,
    user => user.pets,
    { eager: false },
  )
  user: User;
  @Column() userId: number;
  @CreateDateColumn() createdAt: Date;
}
