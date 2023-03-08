import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Users } from '../entity/users.entity';
import { Todo } from '../entity/todo.entity';
import { Role } from '../entity/role.entity';
import { UsersHasTodos } from '../entity/usersHasTodos.entity';
import { RolesHasPermissions } from '../entity/rolesHasPermissions.entity';
import { Permission } from '../entity/permission.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      // type: 'postgres',
      // host: 'localhost',
      // port: 5432,
      // username: this.configService.get('database.username'),
      // password: this.configService.get('database.password'),
      // database: 'postgres',
      // entities: [],
      // synchronize: true,
      type: this.configService.get('database.type'),
      host: this.configService.get('database.host'),
      port: this.configService.get('database.port'),
      username: this.configService.get('database.username'),
      password: this.configService.get('database.password'),
      database: this.configService.get('database.database'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      schema: this.configService.get('database.schema'),
      migrations: [
        /*...*/
      ],
      synchronize: false,

      // type: process.env.DATABASE_TYPE,
      // host: process.env.DATABASE_HOST,
      // port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      // password: process.env.DATABASE_PASSWORD,
      // username: process.env.DATABASE_USERNAME,
      // synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    } as TypeOrmModuleOptions;
  }
}
