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
  Req,
} from '@nestjs/common';

import { AssignRoleDto } from './dto/assign-role-dto';
import { UpdateAssignRoleDto } from './dto/update-assign-role-dto';
import { DeleteAssignRoleDto } from './dto/delete-assign-role-dto';
import { DeleteResult } from 'typeorm';
import { AssignRoleService } from './role.service';

@Controller('users/manage/role')
export class AssignRoleController {
  constructor(private assignRoleService: AssignRoleService) {}
  @Post()
  async assignRole(@Body() assignRoleDto: AssignRoleDto) {
    return await this.assignRoleService.assignRole(assignRoleDto);
  }

  @Patch()
  async updateRole(@Body() updateAssignRoleDto: UpdateAssignRoleDto) {
    return this.assignRoleService.updateRole(updateAssignRoleDto);
  }
  //
  @Delete()
  async deleteRole(@Body() deleteAssignRoleDto: DeleteAssignRoleDto) {
    return await this.assignRoleService.deleteRole(deleteAssignRoleDto);
    // try {
    //   const users = await this.assignRoleService.deleteRole(
    //     deleteAssignRoleDto,
    //   );
    //   if (users instanceof DeleteResult) {
    //     if (users.affected === 0) throw Error('User does not have role');
    //     throw Error('Role has been delete');
    //   } else if (typeof users === 'string') {
    //     throw new Error(users);
    //   }
    //   return await this.assignRoleService.deleteRole(deleteAssignRoleDto);
    // } catch (error) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.FORBIDDEN,
    //       error: error.message,
    //     },
    //     HttpStatus.FORBIDDEN,
    //   );
    // }
  }
}
