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
  UseGuards,
} from '@nestjs/common';
import { AssignTodoService, TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo-dto';
import { UpdateTodoDto } from './dto/update-todo-dto';
import { Todo } from '../entity/todo.entity';
import { AssignTodoDto } from './dto/Manager Todo/assign-todo-dto';
import { UpdateAssignTodoDto } from './dto/Manager Todo/update-assign-todo-dto';
import { DeleteAssignTodoDto } from './dto/Manager Todo/delete-assign-todo-dto';
import { RolesGuard } from '../auth/roles.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { OwnersGuard } from '../auth/owners.guard';
import { AuthGuard } from '@nestjs/passport';
import { HasRoles } from '../auth/decorator/has-roles.decorator';
import { RequirePermissions } from '../auth/decorator/permission.decorator';
import { PermissionEnum } from '../permission/enum/permission.enum';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post()
  async insertOne(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.insertOne(createTodoDto);
  }

  @Get()
  async findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.todoService.findOne(id);
  }

  // @UseGuards(RolesGuard, PermissionsGuard, OwnersGuard)
  // @UseGuards(AuthGuard('jwt'))
  // @HasRoles('User', 'Admin')
  // // @ts-ignore
  // @RequirePermissions(PermissionEnum[2])
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return await this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.delete(id);
  }
}

@Controller('users/manage/todo')
export class AssignTodoController {
  constructor(private assignTodoService: AssignTodoService) {}

  @Post()
  async assignTodo(@Body() assignTodoDto: AssignTodoDto) {
    return await this.assignTodoService.assignTodo(assignTodoDto);
  }

  @Patch()
  async updateTodo(@Body() updateAssignTodoDto: UpdateAssignTodoDto) {
    return await this.assignTodoService.updateTodo(updateAssignTodoDto);
  }

  @Delete()
  deleteTodo(@Body() deleteAssignTodoDto: DeleteAssignTodoDto) {
    return this.assignTodoService.deleteTodo(deleteAssignTodoDto);
  }
}
