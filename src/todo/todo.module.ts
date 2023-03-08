import { Module } from '@nestjs/common';
import { AssignTodoService, TodoService } from './todo.service';
import { AssignTodoController, TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from '../entity/todo.entity';
import { Users } from '../entity/users.entity';
import { UsersHasTodos } from '../entity/usersHasTodos.entity';
import { Role } from '../entity/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, Users, UsersHasTodos, Role])],
  controllers: [TodoController, AssignTodoController],
  providers: [TodoService, AssignTodoService],
  exports: [],
})
export class TodoModule {}
