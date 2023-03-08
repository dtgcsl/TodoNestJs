import { Injectable } from '@nestjs/common';
import { Todo } from '../entity/todo.entity';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateTodoDto } from './dto/update-todo-dto';
import { Users } from '../entity/users.entity';
import { UsersHasTodos } from '../entity/usersHasTodos.entity';
import { AssignTodoDto } from './dto/Manager Todo/assign-todo-dto';
import { UpdateAssignTodoDto } from './dto/Manager Todo/update-assign-todo-dto';
import { DeleteAssignTodoDto } from './dto/Manager Todo/delete-assign-todo-dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private TodoRepository: Repository<Todo>,
    @InjectRepository(Users)
    private UsersRepository: Repository<Users>,
    @InjectRepository(UsersHasTodos)
    private UsersHasTodosRepository: Repository<UsersHasTodos>,
  ) {}

  async create(createTodo: CreateTodoDto) {
    await this.TodoRepository.create(createTodo);
    return this.TodoRepository.save(this.TodoRepository.create(createTodo));
  }

  async findAll(): Promise<Todo[]> {
    return await this.TodoRepository.createQueryBuilder('todo')
      .leftJoinAndSelect('todo.usersHasTodos', 'usersHasTodos')
      .select(['todo', 'usersHasTodos.uid'])
      .orderBy('todo.todoId')
      .getMany();
  }

  async findOne(id: number): Promise<Todo> {
    return await this.TodoRepository.createQueryBuilder('todo')
      .leftJoinAndSelect('todo.usersHasTodos', 'usersHasTodos')
      .select(['todo', 'usersHasTodos.uid'])
      .where('todo.todoId = :id', { id: id })
      .getOne();
  }

  async update(id: number, updateTodo: UpdateTodoDto) {
    const todoUpdate = await this.TodoRepository.findOneByOrFail({
      todoId: id,
    });
    this.TodoRepository.merge(todoUpdate, updateTodo);
    return await this.TodoRepository.save(todoUpdate);
  }

  async delete(id: number) {
    const todoDelete = await this.TodoRepository.delete({
      todoId: id,
    });
    return todoDelete;
  }
}

@Injectable()
export class AssignTodoService {
  constructor(
    @InjectRepository(Users)
    private UsersRepository: Repository<Users>,
    @InjectRepository(Todo)
    private TodoRepository: Repository<Todo>,
    @InjectRepository(UsersHasTodos)
    private UsersHasTodosRepository: Repository<UsersHasTodos>,
  ) {}

  async assignTodo(assignTodoDto: AssignTodoDto) {
    const uid = assignTodoDto.uid;
    const todoId = assignTodoDto.todoId;

    const users = await this.UsersRepository.findOne({
      where: { uid: uid },
    });
    const todo = await this.TodoRepository.findOne({
      where: { todoId: todoId },
    });
    if (!users) return 'Users is not correct';
    if (!todo) return 'Todo is not correct';
    const usersHasTodos = await this.UsersHasTodosRepository.createQueryBuilder(
      'usersHasTodo',
    )
      .where('uid = :uid AND "todoId"= :todoId', { uid: uid, todoId: todoId })
      .getOne();
    if (!usersHasTodos) {
      return this.UsersHasTodosRepository.save(
        this.UsersHasTodosRepository.create(assignTodoDto),
      );
    } else {
      return 'The todo has been assign';
    }
  }

  async updateTodo(updateAssignTodoDto: UpdateAssignTodoDto) {
    const todoId = updateAssignTodoDto.todoId;
    const arrUid = updateAssignTodoDto.uid;
    const users = await this.UsersRepository.createQueryBuilder('users')
      .where('users.uid IN (:...uid)', { uid: arrUid })
      .getMany();
    const todo = await this.TodoRepository.findOne({
      where: { todoId: todoId },
    });
    if (+users.length !== +arrUid.length) {
      return 'Some of users is not correct please try again';
    }
    if (!todo) return 'Todo is not correct';

    await this.UsersHasTodosRepository.delete({
      todoId: todoId,
    });
    for (const uid of arrUid) {
      await this.UsersHasTodosRepository.createQueryBuilder()
        .insert()
        .into(UsersHasTodos)
        .values([
          {
            todoId: todoId,
            uid: uid,
          },
        ])
        .execute();
    }
    return;
  }

  async deleteTodo(deleteAssignTodoDto: DeleteAssignTodoDto) {
    const uid = deleteAssignTodoDto.uid;
    const todoId = deleteAssignTodoDto.todoId;

    const users = await this.UsersRepository.findOne({
      where: { uid: uid },
    });
    const todo = await this.TodoRepository.findOne({
      where: { todoId: todoId },
    });
    if (!users) return 'Users is not correct';
    if (!todo) return 'Todo is not correct';
    return await this.UsersHasTodosRepository.createQueryBuilder('usersHasTodo')
      .delete()
      .from(UsersHasTodos)
      .where('uid = :uid AND todoId = :todoId', {
        uid: uid,
        todoId: todoId,
      })
      .execute();
  }
}
