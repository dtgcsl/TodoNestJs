import { Role } from '../entity/role.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Todo } from '../entity/todo.entity';
import { UpdateAssignRoleDto } from './dto/update-assign-role-dto';
import { UsersHasTodos } from '../entity/usersHasTodos.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum } from './enum/role.enum';
import { Users } from '../entity/users.entity';
import { AssignRoleDto } from './dto/assign-role-dto';
import { DeleteAssignRoleDto } from './dto/delete-assign-role-dto';
import { Repository } from 'typeorm';

@Injectable()
export class AssignRoleService {
  constructor(
    @InjectRepository(Users)
    private UsersRepository: Repository<Users>,
    @InjectRepository(Todo)
    private TodoRepository: Repository<Todo>,
    @InjectRepository(UsersHasTodos)
    private UsersHasTodosRepository: Repository<UsersHasTodos>,
    @InjectRepository(Role)
    private RoleRepository: Repository<Role>,
  ) {}

  async assignRole(assignRoleDto: AssignRoleDto) {
    const uid = assignRoleDto.uid;
    const role = assignRoleDto.role;
    const users = await this.UsersRepository.findOne({
      where: { uid: uid },
    });
    if (!users)
      throw new HttpException('Users is not correct', HttpStatus.BAD_REQUEST);
    const roleOfUser = await this.RoleRepository.createQueryBuilder('role')
      .where('uid = :uid AND name= :role', { uid: uid, role: role })
      .getOne();

    if (!roleOfUser) {
      return this.RoleRepository.save(
        this.RoleRepository.create({ uid: uid, name: role }),
      );
    } else {
      throw new HttpException('Users has been assign', HttpStatus.BAD_REQUEST);
    }
  }

  async updateRole(updateAssignRoleDto: UpdateAssignRoleDto) {
    const uid = updateAssignRoleDto.uid;
    const arrRole = updateAssignRoleDto.role;
    const users = await this.UsersRepository.findOne({
      where: { uid: uid },
    });
    if (!users)
      throw new HttpException('Users is not correct', HttpStatus.BAD_REQUEST);
    if (typeof arrRole === 'string') {
      await this.RoleRepository.delete({
        uid: uid,
      });
      return await this.RoleRepository.createQueryBuilder()
        .insert()
        .into(Role)
        .values([
          {
            uid: uid,
            name: arrRole,
          },
        ])
        .execute();
    }
    if (arrRole.length >= Object.keys(RoleEnum).length)
      if (!users)
        throw new HttpException('Role is repeat', HttpStatus.BAD_REQUEST);
    await this.RoleRepository.delete({
      uid: uid,
    });

    for (const role of arrRole) {
      await this.RoleRepository.createQueryBuilder()
        .insert()
        .into(Role)
        .values([
          {
            uid: uid,
            name: role,
          },
        ])
        .execute();
    }
    return 'Role has been update';
  }

  async deleteRole(deleteAssignRoleDto: DeleteAssignRoleDto) {
    const uid = deleteAssignRoleDto.uid;
    const role = deleteAssignRoleDto.role;

    const users = await this.UsersRepository.findOne({
      where: { uid: uid },
    });

    if (!users)
      throw new HttpException('Users is not correct', HttpStatus.BAD_REQUEST);
    const usersHasRole = await this.RoleRepository.createQueryBuilder('role')
      .delete()
      .from(Role)
      .where('uid = :uid AND name = :role', {
        uid: uid,
        role: role,
      })
      .execute();
    if (usersHasRole.affected === 0)
      throw new HttpException(
        'Users does not have role',
        HttpStatus.BAD_REQUEST,
      );
    return 'Role has been delete';
  }
}
