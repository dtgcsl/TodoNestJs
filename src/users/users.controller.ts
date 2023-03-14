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
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { Users } from '../entity/users.entity';
import { PasswordInterceptor } from '../common/interceptor/password.interceptor';
import { RolesGuard } from '../auth/roles.guard';
import { HasRoles } from '../auth/decorator/has-roles.decorator';
import { RoleEnum } from '../role/enum/role.enum';
import { PermissionsGuard } from '../auth/permissions.guard';
import { OwnersGuard } from '../auth/owners.guard';
import { AuthGuard } from '@nestjs/passport';
import { RequirePermissions } from '../auth/decorator/permission.decorator';
import { PermissionEnum } from '../permission/enum/permission.enum';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  // @HasRoles(<RoleEnum>'Admin')
  @UseInterceptors(PasswordInterceptor)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<Users[]> {
    return this.userService.findAll();
  }

  @Get('/:id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Users> {
    return await this.userService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.delete(id);
  }
}
