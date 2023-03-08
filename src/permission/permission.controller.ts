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
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.permissionService.remove(+id);
    if (result.affected === 0) {
      return 'Permission is not exit';
    } else if (result.affected === 1) {
      return 'Permission have been removed';
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
      return permission;
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
  @Delete()
  async delete(@Body() deleteAssignPermissionDto: DeleteAssignPermissionDto) {
    try {
      return this.assignPermissionService.delete(deleteAssignPermissionDto);
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
