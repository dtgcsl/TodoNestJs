import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from '../entity/todo.entity';
import { Users } from '../entity/users.entity';
import { UsersHasTodos } from '../entity/usersHasTodos.entity';
import { Role } from '../entity/role.entity';
import { AssignRoleController } from './role.controller';
import { AssignRoleService } from './role.service';
import { RolesHasPermissions } from '../entity/rolesHasPermissions.entity';
import { Permission } from '../entity/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Todo,
      Users,
      UsersHasTodos,
      Role,
      RolesHasPermissions,
      Permission,
    ]),
  ],
  controllers: [AssignRoleController],
  providers: [AssignRoleService],
  exports: [AssignRoleService],
})
export class RoleModule {}
