import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entity/users.entity';
import { UsersService } from './users.service';
import * as bcrypt from './../utils/bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';

const testId = 1;
const testName = 'Test Name 1';
const testPassword = 'Test Password 1';

const oneUsers = new Users(testId, testName, testPassword);

const usersArray = [
  new Users(testId, testName, testPassword),
  new Users(2, 'Test Name 2', 'Test Password 2'),
  new Users(3, 'Test Name 4', 'Test Password 4'),
];
// mockConnection

describe('---UsersService---', () => {
  let service: UsersService;
  let repo: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: {
            create: jest.fn().mockReturnValue(oneUsers),
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
            findOneOrFail: jest.fn().mockResolvedValue(oneUsers),
            update: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('usersService should be defined', () => {
    expect(service).toBeDefined();
  });

  it('usersRepository should be defined', () => {
    expect(repo).toBeDefined();
  });
  describe('* create', () => {
    it('should call insert a users', () => {
      expect(
        service.insertOne({
          id: testId,
          name: testName,
          password: testPassword,
        }),
      ).resolves.toEqual(oneUsers);
    });

    it('should encode password correctly', async () => {
      jest.spyOn(bcrypt, 'encodePassword').mockReturnValueOnce('hashPassword');
      await service.insertOne({
        id: testId,
        name: testName,
        password: testPassword,
      });
      await expect(bcrypt.encodePassword).toHaveBeenCalledWith(testPassword);
    });
    it('should call usersRepository.create with correct params', async () => {
      jest.spyOn(bcrypt, 'encodePassword').mockReturnValueOnce('hashPassword');
      await service.insertOne({
        id: testId,
        name: testName,
        password: testPassword,
      });
      expect(repo.create).toBeCalledTimes(1);
      expect(repo.create).toBeCalledWith({
        id: testId,
        name: testName,
        password: 'hashPassword',
      });
      expect(repo.save).toBeCalledTimes(1);
    });
  });

  describe('* findAll', () => {
    it('should return array of users', async () => {
      const createQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        orderBy: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        getMany: () => usersArray,
      };

      jest
        .spyOn(repo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      const users = await service.findAll();
      expect(users).toEqual(usersArray);
    });
  });

  describe('* findOneById', () => {
    it('should return one Users', () => {
      const repoSpy = jest
        .spyOn(repo, 'findOneOrFail')
        .mockResolvedValue(oneUsers);

      expect(service.findById(testId)).resolves.toEqual(oneUsers);
      expect(repoSpy).toBeCalledWith({
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
          uid: testId,
        },
      });
    });
    it('should throw a error "Not found that id "', () => {
      const repoSpy = jest
        .spyOn(repo, 'findOneOrFail')
        .mockRejectedValue(new Error('Not found that id'));

      expect(service.findById(NaN)).rejects.toEqual(
        new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Not found that id',
          },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('* findOne', () => {
    it('should return one Users', () => {
      const repoSpy = jest
        .spyOn(repo, 'findOneOrFail')
        .mockResolvedValue(oneUsers);

      expect(service.findOne(testName)).resolves.toEqual(oneUsers);
      expect(repoSpy).toBeCalledWith({
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
          name: testName,
        },
      });
    });
    it('should throw a error "Not found that name "', () => {
      const repoSpy = jest.spyOn(repo, 'findOneOrFail').mockRejectedValue(
        new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Not found that id',
          },
          HttpStatus.BAD_REQUEST,
        ),
      );

      expect(service.findOne('')).rejects.toEqual(
        new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Not found that name',
          },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('* updateOne', () => {
    it('should call update method', async () => {
      const repoSpy = jest
        .spyOn(repo, 'update')
        .mockResolvedValue({ generatedMaps: [], raw: [], affected: 1 });
      await jest.spyOn(repo, 'findOne').mockResolvedValue(oneUsers);
      await expect(
        service.updateOne(testId, {
          name: testName,
          password: testPassword,
        }),
      ).resolves.toEqual(oneUsers);
      expect(repoSpy).toBeCalledWith(testId, {
        name: testName,
        password: testPassword,
      });
    });

    it('should throw a error "Not found that id"', () => {
      const repoSpy = jest
        .spyOn(repo, 'update')
        .mockRejectedValue(
          new HttpException('Not found that id', HttpStatus.BAD_REQUEST),
        );

      expect(
        service.updateOne(testId, {
          name: testName,
          password: testPassword,
        }),
      ).rejects.toEqual(
        new HttpException('Not found that id', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('* delete', () => {
    it('should delete one Users', () => {
      const repoSpy = jest
        .spyOn(repo, 'delete')
        .mockResolvedValue(new Promise(() => true));

      expect(service.delete(testId)).resolves.toEqual('User has been delete');
      expect(repoSpy).toBeCalledWith({ uid: testId });
    });

    it('should throw a error "Not found that id"', () => {
      const repoSpy = jest.spyOn(repo, 'delete').mockRejectedValue(
        new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Not found that id',
          },
          HttpStatus.BAD_REQUEST,
        ),
      );

      expect(service.delete(testId)).rejects.toEqual(
        new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Not found that id',
          },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });
});
