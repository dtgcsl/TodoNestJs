import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../entity/users.entity';
import { AppModule } from '../app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  const newUsers = { name: 'Giang', password: '1' };

  const mockUsers = [{ id: 1, name: 'Giang', password: '1' }];

  const mockUsersRepository = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockImplementation(),
    findOneOrFail: jest.fn().mockResolvedValue(mockUsers),
    update: jest.fn(),
    findOne: jest.fn().mockResolvedValue(mockUsers),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(Users))
      .useValue(mockUsersRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', async () => {
    const users = await request(app.getHttpServer())
      .get('/users/1')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(mockUsers);
    expect(users.body).toEqual(mockUsers);
  });

  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(newUsers)
      .expect(201);
  });

  it('/users (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/users/3')
      .send({ name: 'Giang', password: '1' })
      .expect(200);
  });

  it('/users (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/users/5')
      .expect(200)
      .expect('User has been delete');
  });
});
