import { Module } from '@nestjs/common';
import {
  AssignPermissionService,
  PermissionService,
} from './permission.service';
import {
  AssignPermission,
  PermissionController,
} from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../entity/permission.entity';
import { RolesHasPermissions } from '../entity/rolesHasPermissions.entity';
import { Role } from '../entity/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, RolesHasPermissions, Role])],
  controllers: [PermissionController, AssignPermission],
  providers: [PermissionService, AssignPermissionService],
  exports: [],
})
export class PermissionModule {}
