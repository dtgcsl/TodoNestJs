import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Users } from '../entity/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import * as bcrypt from 'bcryptjs';
import { Todo } from '../entity/todo.entity';
import { AssignRoleDto } from '../role/dto/assign-role-dto';
import { Role } from '../entity/role.entity';
import { UsersHasTodos } from '../entity/usersHasTodos.entity';
import { AssignTodoDto } from '../todo/dto/Manager Todo/assign-todo-dto';
import { UpdateAssignTodoDto } from '../todo/dto/Manager Todo/update-assign-todo-dto';
import { DeleteAssignTodoDto } from '../todo/dto/Manager Todo/delete-assign-todo-dto';
import { UpdateAssignRoleDto } from '../role/dto/update-assign-role-dto';
import { RoleEnum } from '../role/enum/role.enum';
import { DeleteAssignRoleDto } from '../role/dto/delete-assign-role-dto';

export type User = any;

const saltOrRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private UsersRepository: Repository<Users>,
    @InjectRepository(Role)
    private RoleRepository: Repository<Role>,
  ) {}

  async create(createUser: CreateUserDto) {
    createUser.password = await bcrypt.hash(createUser.password, saltOrRounds);
    return await this.UsersRepository.save(
      this.UsersRepository.create(createUser),
    );
  }

  async findAll(): Promise<any> {
    return await this.UsersRepository.createQueryBuilder('users')
      .leftJoinAndSelect('users.roles', 'role')
      .leftJoinAndSelect('users.usersHasTodos', 'usersHasTodos')
      .leftJoinAndSelect('usersHasTodos.todo', 'todo')
      .orderBy('users.uid')
      .getMany();
    // return await this.UsersRepository.find({
    //   select: {
    //     uid: true,
    //     name: true,
    //     roles: {
    //       name: true,
    //     },
    //     usersHasTodos: {
    //       todoId: true,
    //       todo: {
    //         name: true,
    //         createAt: true,
    //         updateAt: true,
    //         createdById: true,
    //       },
    //     },
    //   },
    //   relations: {
    //     roles: true,
    //     usersHasTodos: {
    //       todo: true,
    //     },
    //   },
    //   order: {
    //     uid: 'ASC',
    //   },
    // });
  }

  async findById(id: number): Promise<Users | undefined> {
    // const a = await this.UsersRepository.createQueryBuilder('users')
    //   .leftJoinAndSelect('users.roles', 'role')
    //   .leftJoinAndSelect('users.usersHasTodos', 'usersHasTodos')
    //   .leftJoinAndSelect('usersHasTodos.todo', 'todo')
    //   .where('users.uid = :uid', { uid: id })
    //   .getOne();
    // return a;
    return await this.UsersRepository.findOneOrFail({
      select: {
        uid: true,
        name: true,
        roles: {
          name: true,
        },
        usersHasTodos: {
          todoId: true,
          todo: {
            name: true,
            createAt: true,
            updateAt: true,
            createdById: true,
          },
        },
      },
      relations: {
        roles: {
          rolesHasPermissions: true,
        },
        usersHasTodos: {
          todo: true,
        },
      },
      where: {
        uid: id,
      },
    });
  }

  async findOne(name: string): Promise<Users | undefined> {
    try {
      return await this.UsersRepository.findOneOrFail({
        select: { uid: true, name: true, password: true },
        relations: {
          roles: {
            rolesHasPermissions: {
              permission: true,
            },
          },
          usersHasTodos: true,
        },
        where: {
          name: name,
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Username or password not correct! Please try again',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async update(id: number, updateUser: UpdateUserDto) {
    const userUpdate = await this.UsersRepository.findOneByOrFail({
      uid: id,
    });
    this.UsersRepository.merge(userUpdate, updateUser);
    return await this.UsersRepository.save(userUpdate);
  }

  async delete(id: number) {
    return await this.UsersRepository.delete({ uid: id });
  }
}
