import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Users } from '../entity/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import * as bcrypt from 'bcryptjs';
import { Role } from '../entity/role.entity';

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
  }

  async findById(id: number): Promise<Users | undefined> {
    try {
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
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Not found that id',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
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
          status: HttpStatus.BAD_REQUEST,
          error: 'Not found that id',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  async update(id: number, updateUser: UpdateUserDto) {
    try {
      const userUpdate = await this.UsersRepository.findOneByOrFail({
        uid: id,
      });
      this.UsersRepository.merge(userUpdate, updateUser);
      return await this.UsersRepository.save(userUpdate);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Not found that id',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  async delete(id: number) {
    try {
      const users = await this.UsersRepository.delete({ uid: id });
      if (users.affected === 1) return 'User has been delete';
      throw new Error();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Not found that id',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }
}
