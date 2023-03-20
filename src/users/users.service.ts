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
import { encodePassword } from '../utils/bcrypt';

export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private UsersRepository: Repository<Users>,
  ) {}

  async insertOne(createUserDto: CreateUserDto) {
    createUserDto.password = await encodePassword(createUserDto.password);
    const newUser = this.UsersRepository.create(createUserDto);
    await this.UsersRepository.save(newUser);
    return newUser;
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
          error: 'Not found that name',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  async updateOne(id: number, updateUser: UpdateUserDto) {
    const a = await this.UsersRepository.update(id, updateUser);
    if (a?.affected === 0) {
      throw new HttpException('Not found that id', HttpStatus.BAD_REQUEST);
    }
    return this.UsersRepository.findOne({ where: { uid: id } });
  }

  async delete(id: number) {
    const users = await this.UsersRepository.delete({ uid: id });
    if (users?.affected === 0) {
      throw new HttpException('Not found that id', HttpStatus.BAD_REQUEST);
    }
    return 'User has been delete';
  }
}
