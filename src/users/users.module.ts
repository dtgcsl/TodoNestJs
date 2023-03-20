import { Module } from '@nestjs/common';
import { Role } from '../entity/role.entity';
import { Todo } from '../entity/todo.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersHasTodos } from '../entity/usersHasTodos.entity';
import { Users } from '../entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, Users, UsersHasTodos, Role])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
