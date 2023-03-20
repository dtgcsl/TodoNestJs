import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entity/permission.entity';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { Role } from '../entity/role.entity';
import { RolesHasPermissions } from '../entity/rolesHasPermissions.entity';
import { UpdateAssignTodoDto } from '../todo/dto/Manager Todo/update-assign-todo-dto';
import { UsersHasTodos } from '../entity/usersHasTodos.entity';
import { EditAssignPermissionDto } from './dto/edit-assign-permission.dto';
import { DeleteAssignPermissionDto } from './dto/delete-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private PermissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private RoleRepository: Repository<Role>,
    @InjectRepository(RolesHasPermissions)
    private RolesHasPermissionsRepository: Repository<RolesHasPermissions>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    return await this.PermissionRepository.save(
      await this.PermissionRepository.create(createPermissionDto),
    );
  }

  findAll() {
    return this.PermissionRepository.createQueryBuilder('permission')
      .leftJoinAndSelect('permission.rolesHasPermissions', 'roleHasPermissions')
      .select(['permission', 'roleHasPermissions.rid'])
      .orderBy('permission.id')
      .getMany();
  }

  findOne(id: number) {
    const permission = this.PermissionRepository.createQueryBuilder(
      'permission',
    )
      .leftJoinAndSelect('permission.rolesHasPermissions', 'roleHasPermissions')
      .select(['permission', 'roleHasPermissions.rid'])
      // .orderBy('permission.id')
      .where('permission.id = :id', { id: id })
      .getOne();
    if (!permission)
      throw new HttpException('Not found that id', HttpStatus.BAD_REQUEST);
    return permission;
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permissionUpdate = await this.PermissionRepository.findOne({
      where: { id: id },
    });
    if (!permissionUpdate) return 'Not found that id';
    this.PermissionRepository.merge(permissionUpdate, updatePermissionDto);
    return await this.PermissionRepository.save(permissionUpdate);
  }

  async remove(id: number) {
    return await this.PermissionRepository.delete({
      id: id,
    });
  }
}

@Injectable()
export class AssignPermissionService {
  constructor(
    @InjectRepository(Permission)
    private PermissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private RoleRepository: Repository<Role>,
    @InjectRepository(RolesHasPermissions)
    private RolesHasPermissionsRepository: Repository<RolesHasPermissions>,
  ) {}
  async assignPermission(assignPermissionDto: AssignPermissionDto) {
    const rid = assignPermissionDto.rid;
    const permissionId = assignPermissionDto.permissionId;

    const role = await this.RoleRepository.findOne({
      where: { rid: rid },
    });

    const permission = await this.PermissionRepository.findOne({
      where: { id: permissionId },
    });
    if (!role) return 'RoleId is not correct';
    if (!permission) return 'PermissionId is not correct';
    const rolesHasPermissions =
      await this.RolesHasPermissionsRepository.createQueryBuilder(
        'rolesHasPermissions',
      )
        .where('rid = :rid AND "permissionId" = :permissionId', {
          rid: rid,
          permissionId: permissionId,
        })
        .getOne();
    if (!rolesHasPermissions) {
      return this.RolesHasPermissionsRepository.save(
        this.RolesHasPermissionsRepository.create(assignPermissionDto),
      );
    }
  }
  async edit(editAssignPermissionDto: EditAssignPermissionDto) {
    const permissionId = editAssignPermissionDto.permissionId;
    const ridArr = editAssignPermissionDto.rid;
    const permission = await this.PermissionRepository.createQueryBuilder(
      'permission',
    )
      .where('permission.id = :permissionId', { permissionId: permissionId })
      .getMany();
    if (!permission) return 'Permission is not correct';
    const role = await this.RoleRepository.createQueryBuilder('role')
      .where('role.rid IN (:...ridArr)', { ridArr: ridArr })
      .getMany();
    if (+role.length !== +ridArr.length) return 'Some rid is not correct';
    await this.RolesHasPermissionsRepository.delete({
      permissionId: permissionId,
    });
    for (const rid of ridArr) {
      await this.RolesHasPermissionsRepository.createQueryBuilder()
        .insert()
        .into(RolesHasPermissions)
        .values([
          {
            permissionId: permissionId,
            rid: rid,
          },
        ])
        .execute();
    }
    return { success: 'The data has been update' };
  }
  async delete(deleteAssignPermissionDto: DeleteAssignPermissionDto) {
    const rid = deleteAssignPermissionDto.rid;
    const permissionId = deleteAssignPermissionDto.permissionId;

    const role = await this.RoleRepository.findOne({
      where: { rid: rid },
    });
    if (!role) return 'Role is not correct';
    const permission = await this.PermissionRepository.findOne({
      where: { id: permissionId },
    });
    if (!permission) return 'Permission is not correct';
    return await this.RolesHasPermissionsRepository.createQueryBuilder(
      'rolesHasPermission',
    )
      .delete()
      .from(RolesHasPermissions)
      .where('rid = :rid AND permissionId = :permissionId', {
        rid: rid,
        permissionId: permissionId,
      })
      .execute();
  }
}
