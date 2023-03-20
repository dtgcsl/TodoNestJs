import { Todo } from '../entity/todo.entity';
import { TodoService } from './todo.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

const oneTodo = new Todo(1, 'test1', new Date(2023, 5, 5, 15, 15), null, 1);

const todosArray = [
  new Todo(1, 'test1', new Date(2023, 5, 5, 15, 15), null, 1),
  new Todo(2, 'test2', new Date(2023, 5, 5, 15, 15), null, 1),
  new Todo(2, 'test3', new Date(2023, 5, 5, 15, 15), null, 1),
];

describe('---TodoService---', () => {
  let service: TodoService;
  let repo: Repository<Todo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: {
            create: jest.fn().mockReturnValue(oneTodo),
            save: jest.fn().mockReturnValue(oneTodo),
            createQueryBuilder: jest.fn(),
            findOneOrFail: jest.fn().mockResolvedValue(oneTodo),
            update: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<TodoService>(TodoService);
    repo = module.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  // afterEach(() => {
  //   jest.resetAllMocks();
  // });

  it('todoService should be defined', () => {
    expect(service).toBeDefined();
  });

  it('todoRepository should be defined', () => {
    expect(repo).toBeDefined();
  });
  describe('* create', () => {
    it('should call insert a todo', () => {
      expect(
        service.insertOne({
          id: 1,
          name: 'test1',
          createAt: '10:30:59+07',
          updateAt: '10:30:59+07',
          createdId: 1,
        }),
      ).resolves.toEqual(oneTodo);
    });

    it('should call todoRepository.create with correct params', async () => {
      await service.insertOne({
        id: 1,
        name: 'test1',
        createAt: '10:30:59+07',
        updateAt: '10:30:59+07',
        createdId: 1,
      });
      expect(repo.create).toBeCalledTimes(1);
      expect(repo.create).toBeCalledWith({
        id: 1,
        name: 'test1',
        createAt: '10:30:59+07',
        updateAt: '10:30:59+07',
        createdId: 1,
      });
      expect(repo.save).toBeCalledTimes(1);
    });
  });
  describe('* findAll', () => {
    it('should return array of todo', async () => {
      const createQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        select: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        orderBy: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        getMany: () => todosArray,
      };

      jest
        .spyOn(repo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      const todos = await service.findAll();
      expect(todos).toEqual(todosArray);
    });
  });
  describe('* findOneById', () => {
    it('should return one Todo', async () => {
      const createQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        select: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        orderBy: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        where: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        getOne: () => oneTodo,
      };

      jest
        .spyOn(repo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      const todos = await service.findOne(1);
      expect(todos).toEqual(oneTodo);
    });
    it('should throw a error "Not found that id "', () => {
      const createQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        select: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        orderBy: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        where: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        getOne: jest.fn().mockRejectedValue(
          new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              error: 'Not found that id',
            },
            HttpStatus.BAD_REQUEST,
          ),
        ),
      };

      jest
        .spyOn(repo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      expect(service.findOne(NaN)).rejects.toEqual(
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
  describe('* update', () => {
    it('should call update method', async () => {
      const repoSpy = jest
        .spyOn(repo, 'update')
        .mockResolvedValue({ generatedMaps: [], raw: [], affected: 1 });
      await jest.spyOn(repo, 'findOne').mockResolvedValue(oneTodo);
      await expect(
        service.update(1, {
          id: 1,
          name: 'test2',
          createAt: '10:30:59+07',
          updateAt: '10:30:59+07',
        }),
      ).resolves.toEqual(oneTodo);
      expect(repoSpy).toBeCalledWith(1, {
        id: 1,
        name: 'test2',
        createAt: '10:30:59+07',
        updateAt: '10:30:59+07',
      });
    });
    it('should throw a error "Not found that id"', () => {
      const repoSpy = jest
        .spyOn(repo, 'update')
        .mockRejectedValue(
          new HttpException('Not found that id', HttpStatus.BAD_REQUEST),
        );

      expect(
        service.update(1, {
          id: 1,
          name: 'test2',
          createAt: '10:30:59+07',
          updateAt: '10:30:59+07',
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

      expect(service.delete(1)).resolves.toEqual('User has been delete');
      expect(repoSpy).toBeCalledWith({ todoId: 1 });
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

      expect(service.delete(1)).rejects.toEqual(
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
