import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    const Todo = await this.TodoRepository.createQueryBuilder('todo')
      .leftJoinAndSelect('todo.usersHasTodos', 'usersHasTodos')
      .select(['todo', 'usersHasTodos.uid'])
      .where('todo.todoId = :id', { id: id })
      .getOne();
    if (Todo === null) {
      throw new HttpException('Not found that id', HttpStatus.BAD_REQUEST);
    }
    return Todo;
  }

  async update(id: number, updateTodo: UpdateTodoDto) {
    try {
      const todoUpdate = await this.TodoRepository.findOneByOrFail({
        todoId: id,
      });

      this.TodoRepository.merge(todoUpdate, updateTodo);
      return await this.TodoRepository.save(todoUpdate);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Not found that id',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  async delete(id: number) {
    const todoDelete = await this.TodoRepository.delete({
      todoId: id,
    });
    if (todoDelete.affected === 1) return 'Todo has been delete';
    throw new HttpException('Not found that id', HttpStatus.BAD_REQUEST);
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

    const todo = await this.TodoRepository.findOne({
      where: { todoId: todoId },
    });
    if (!todo)
      throw new HttpException('Todo is not correct', HttpStatus.BAD_REQUEST);
    const users = await this.UsersRepository.findOne({
      where: { uid: uid },
    });
    if (!users)
      throw new HttpException('Users is not correct', HttpStatus.BAD_REQUEST);
    const usersHasTodos = await this.UsersHasTodosRepository.createQueryBuilder(
      'usersHasTodo',
    )
      .where('uid = :uid AND "todoId"= :todoId', {
        uid: uid,
        todoId: todoId,
      })
      .getOne();
    if (usersHasTodos)
      throw new HttpException(
        'The todo has been assin',
        HttpStatus.BAD_REQUEST,
      );
    return this.UsersHasTodosRepository.save(
      this.UsersHasTodosRepository.create(assignTodoDto),
    );
  }

  async updateTodo(updateAssignTodoDto: UpdateAssignTodoDto) {
    const todoId = updateAssignTodoDto.todoId;
    const arrUid = updateAssignTodoDto.uid;

    const todo = await this.TodoRepository.findOne({
      where: { todoId: todoId },
    });
    if (!todo)
      throw new HttpException('Todo is not correct', HttpStatus.BAD_REQUEST);
    const users = await this.UsersRepository.createQueryBuilder('users')
      .where('users.uid IN (:...uid)', { uid: arrUid })
      .getMany();
    if (+users.length !== +arrUid.length) {
      throw new HttpException(
        'Some of users is not correct please try again',
        HttpStatus.BAD_REQUEST,
      );
    }
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
    return 'The data has been update';
  }

  async deleteTodo(deleteAssignTodoDto: DeleteAssignTodoDto) {
    const uid = deleteAssignTodoDto.uid;
    const todoId = deleteAssignTodoDto.todoId;

    const users = await this.UsersRepository.findOne({
      where: { uid: uid },
    });
    if (!users)
      throw new HttpException('Users is not correct', HttpStatus.BAD_REQUEST);
    const todo = await this.TodoRepository.findOne({
      where: { todoId: todoId },
    });
    if (!todo)
      throw new HttpException('Todo is not correct', HttpStatus.BAD_REQUEST);
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
