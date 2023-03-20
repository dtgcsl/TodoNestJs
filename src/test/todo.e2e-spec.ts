import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from '../entity/todo.entity';
import { AppModule } from '../app.module';

describe('Todo Controller (e2e)', () => {
  let app: INestApplication;

  const newTodo = {
    id: 1,
    name: 'test1',
    createAt: '10:30:59+07',
    updateAt: '10:30:59+07',
    createdId: 1,
  };

  const mockTodo = [
    {
      id: 1,
      name: 'test1',
      createAt: '10:30:59+07',
      updateAt: '10:30:59+07',
      createdId: 1,
    },
  ];

  const mockTodoRepository = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockImplementation(),
    getOne: jest.fn().mockResolvedValue(mockTodo),
    findOneOrFail: jest.fn().mockResolvedValue(mockTodo),
    update: jest.fn(),
    findOne: jest.fn().mockResolvedValue(mockTodo),
    delete: jest.fn().mockResolvedValue('Todo has been delete'),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(Todo))
      .useValue(mockTodoRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/todo (GET)', async () => {
    const todo = await request(app.getHttpServer())
      .get('/todo/1')
      // .expect('Content-Type', /json/)
      .expect(200)
      .expect(mockTodo);
    expect(todo.body).toEqual(mockTodo);
  });

  it('/todo (POST)', () => {
    return request(app.getHttpServer()).post('/todo').send(newTodo).expect(201);
  });

  it('/todo (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/todo/3')
      .send({
        id: 1,
        name: 'test1',
        createAt: '10:30:59+07',
        updateAt: '10:30:59+07',
        createdId: 1,
      })
      .expect(200);
  });

  it('/todo (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/todo/3')
      .expect(200)
      .expect('Todo has been delete');
  });
});
