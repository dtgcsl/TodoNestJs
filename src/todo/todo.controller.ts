import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AssignTodoService, TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo-dto';
import { UpdateTodoDto } from './dto/update-todo-dto';
import { Todo } from '../entity/todo.entity';
import { AssignTodoDto } from './dto/Manager Todo/assign-todo-dto';
import { UpdateAssignTodoDto } from './dto/Manager Todo/update-assign-todo-dto';
import { DeleteAssignTodoDto } from './dto/Manager Todo/delete-assign-todo-dto';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  async findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const Todo = await this.todoService.findOne(id);
      if (Todo !== null) {
        return Todo;
      } else {
        throw new Error();
      }
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Not found that id',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    try {
      const todo = await this.todoService.update(id, updateTodoDto);
      return todo;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Not found that id',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      const todo = await this.todoService.delete(id);
      if (todo.affected === 1) return 'Todo has been delete';
      throw new Error();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Not found that id',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}

@Controller('users/manage/todo')
export class AssignTodoController {
  constructor(private assignTodoService: AssignTodoService) {}

  @Post()
  async assignTodo(@Body() assignTodoDto: AssignTodoDto) {
    try {
      const assign = await this.assignTodoService.assignTodo(assignTodoDto);
      if (typeof assign === 'string') {
        throw new Error(assign);
      }
      return assign;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Patch()
  async updateTodo(@Body() updateAssignTodoDto: UpdateAssignTodoDto) {
    try {
      const assign = await this.assignTodoService.updateTodo(
        updateAssignTodoDto,
      );
      if (typeof assign === 'string') {
        throw new Error(assign);
      }
      return 'The data has been update';
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Delete()
  deleteTodo(@Body() deleteAssignTodoDto: DeleteAssignTodoDto) {
    try {
      return this.assignTodoService.deleteTodo(deleteAssignTodoDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
