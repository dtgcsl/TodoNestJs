import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Users } from '../entity/users.entity';
import { Todo } from '../entity/todo.entity';
import { Role } from '../entity/role.entity';
import { UsersHasTodos } from '../entity/usersHasTodos.entity';
import { Permission } from '../entity/permission.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1',
  database: 'postgres',
  synchronize: false,
  schema: 'Todo',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migration/*.js'],
} as DataSourceOptions);
