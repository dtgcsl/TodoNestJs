import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Users } from '../entity/users.entity';
import { Todo } from '../entity/todo.entity';
import { Role } from '../entity/role.entity';
import { UsersHasTodos } from '../entity/usersHasTodos.entity';
import { Permission } from '../entity/permission.entity';

export const AppDataSource = new DataSource({
  /*
  DATABASE_TYPE='postgres'
  DATABASE_HOST='localhost'
  DATABASE_PORT=5432
  DATABASE_USERNAME='postgres'
  DATABASE_PASSWORD='1'
  DATABASE_DATABASE=
  DATABASE_ENTITIES=
  DATABASE_SCHEMA='Todo'
  DATABASE_SYNCHRONIZE=,*/
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1',
  database: 'postgres',
  synchronize: true,
  entities: [Users, Todo, Role, UsersHasTodos, Permission],
} as DataSourceOptions);
