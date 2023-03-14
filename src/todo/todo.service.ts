import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    try {
      const Todo = await this.TodoRepository.createQueryBuilder('todo')
        .leftJoinAndSelect('todo.usersHasTodos', 'usersHasTodos')
        .select(['todo', 'usersHasTodos.uid'])
        .where('todo.todoId = :id', { id: id })
        .getOne();
      if (Todo !== null) {
        return Todo;
      } else {
        throw new Error();
      }
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
    try {
      const todoDelete = await this.TodoRepository.delete({
        todoId: id,
      });
      if (todoDelete.affected === 1) return 'Todo has been delete';
      throw new Error();
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
    try {
      const uid = assignTodoDto.uid;
      const todoId = assignTodoDto.todoId;

      const todo = await this.TodoRepository.findOne({
        where: { todoId: todoId },
      });
      if (!todo) throw new Error('Todo is not correct');
      const users = await this.UsersRepository.findOne({
        where: { uid: uid },
      });
      if (!users) throw new Error('Users is not correct');
      const usersHasTodos =
        await this.UsersHasTodosRepository.createQueryBuilder('usersHasTodo')
          .where('uid = :uid AND "todoId"= :todoId', {
            uid: uid,
            todoId: todoId,
          })
          .getOne();
      if (!usersHasTodos) {
        return this.UsersHasTodosRepository.save(
          this.UsersHasTodosRepository.create(assignTodoDto),
        );
      } else {
        throw new Error('The todo has been assign');
      }
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  async updateTodo(updateAssignTodoDto: UpdateAssignTodoDto) {
    try {
      const todoId = updateAssignTodoDto.todoId;
      const arrUid = updateAssignTodoDto.uid;

      const todo = await this.TodoRepository.findOne({
        where: { todoId: todoId },
      });
      if (!todo) throw new Error('Todo is not correct');
      const users = await this.UsersRepository.createQueryBuilder('users')
        .where('users.uid IN (:...uid)', { uid: arrUid })
        .getMany();
      if (+users.length !== +arrUid.length) {
        throw new Error('Some of users is not correct please try again');
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
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  async deleteTodo(deleteAssignTodoDto: DeleteAssignTodoDto) {
    try {
      const uid = deleteAssignTodoDto.uid;
      const todoId = deleteAssignTodoDto.todoId;

      const users = await this.UsersRepository.findOne({
        where: { uid: uid },
      });
      if (!users) throw new Error('Users is not correct');
      const todo = await this.TodoRepository.findOne({
        where: { todoId: todoId },
      });
      if (!todo) throw new Error('Todo is not correct');
      return await this.UsersHasTodosRepository.createQueryBuilder(
        'usersHasTodo',
      )
        .delete()
        .from(UsersHasTodos)
        .where('uid = :uid AND todoId = :todoId', {
          uid: uid,
          todoId: todoId,
        })
        .execute();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
