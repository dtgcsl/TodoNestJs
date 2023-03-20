import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  AssignPermissionService,
  PermissionService,
} from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { UpdateTodoDto } from '../todo/dto/update-todo-dto';
import { EditAssignPermissionDto } from './dto/edit-assign-permission.dto';
import { DeleteAssignPermissionDto } from './dto/delete-permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionService.create(createPermissionDto);
  }

  @Get()
  async findAll() {
    return await this.permissionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.permissionService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    try {
      const permission = await this.permissionService.update(
        +id,
        updatePermissionDto,
      );
      if (typeof permission === 'string') {
        throw new Error(permission);
      }
      return permission;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.permissionService.remove(+id);
      if (result.affected === 0) {
        throw new Error('Permission is not exit');
      } else if (result.affected === 1) {
        return 'Permission have been removed';
      }
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}

@Controller('assign/permission')
export class AssignPermission {
  constructor(
    private readonly assignPermissionService: AssignPermissionService,
  ) {}

  @Post()
  async assignPermission(@Body() assignPermissionDto: AssignPermissionDto) {
    try {
      const assign = await this.assignPermissionService.assignPermission(
        assignPermissionDto,
      );
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
  async update(@Body() editAssignPermissionDto: EditAssignPermissionDto) {
    try {
      const permission = await this.assignPermissionService.edit(
        editAssignPermissionDto,
      );
      if (typeof permission === 'string') throw new Error(permission);
      return permission;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
  @Delete()
  async delete(@Body() deleteAssignPermissionDto: DeleteAssignPermissionDto) {
    try {
      const permission = this.assignPermissionService.delete(
        deleteAssignPermissionDto,
      );

      if (typeof permission === 'string') {
        throw new Error(permission);
      }
      return permission;
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
