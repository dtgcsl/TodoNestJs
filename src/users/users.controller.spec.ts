import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user-dto';

describe('UserController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn((dto) => {
      return {
        id: 1,
        ...dto,
      };
    }),
    findAll: jest.fn().mockImplementation(() => [
      { id: 1, name: 'test1', password: 'abc' },
      { id: 2, name: 'test2', password: 'abc' },
      { id: 3, name: 'test3', password: 'abc' },
    ]),

    findById: jest.fn().mockImplementation((id: number) => {
      return {
        id: id,
        name: 'test1',
        password: 'abc',
      };
    }),

    update: jest.fn().mockImplementation((id, dto) => ({
      id,
      ...dto,
    })),
    delete: jest.fn().mockImplementation((id) => 'User has been delete'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be create a user', async () => {
    const dto = { id: 1, name: 'Giang', password: '1234' };
    expect(await controller.create(dto)).toEqual({
      id: expect.any(Number),
      ...dto,
    });

    expect(mockUsersService.create).toHaveBeenCalledWith(dto);
  });

  it('should get array of users', async () => {
    await expect(controller.findAll()).resolves.toEqual([
      { id: 1, name: 'test1', password: 'abc' },
      { id: 2, name: 'test2', password: 'abc' },
      { id: 3, name: 'test3', password: 'abc' },
    ]);
  });

  it('should get a single user', async () => {
    expect(await controller.findById(1234)).toEqual({
      id: 1234,
      name: 'test1',
      password: 'abc',
    });
  });

  it('should update a user', async () => {
    const dto = { name: 'Giang', password: '1234' };
    expect(await controller.update(1, dto)).toEqual({
      id: expect.any(Number),
      ...dto,
    });

    expect(mockUsersService.update).toHaveBeenCalled();
  });

  it('should delete a users', async () => {
    expect(await controller.delete(1234)).toMatch('User has been delete');
  });
});
