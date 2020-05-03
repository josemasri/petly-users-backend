import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
// Unique keys
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('text')
  jwt: string;
}
