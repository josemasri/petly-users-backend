import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Jose1336',
  database: 'petly',
  entities: [__dirname + '/../**/*.entity.js'],
  // Just for development
  synchronize: false,
};
