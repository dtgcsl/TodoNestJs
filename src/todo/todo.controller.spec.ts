import { Test, TestingModule } from '@nestjs/testing';
import { AssignTodoController, TodoController } from './todo.controller';
import { TodoService } from './todo.service';

describe('Todo Controller', () => {
  let controller: TodoController;
  const dto = {
    id: 1,
    name: 'test1',
    createAt: '10:30:59+07',
    updateAt: '10:30:59+07',
    createdId: 1,
  };
  const mockTodoService = {
    insertOne: jest.fn().mockImplementation((dto) => {
      return {
        id: 1,
        ...dto,
      };
    }),

    findAll: jest.fn().mockImplementation(() => [
      { todoId: 1, name: 'test1', createAt: '10:30:59+07', updateAt: null },
      { todoId: 2, name: 'test2', createAt: '10:30:59+07', updateAt: null },
      { todoId: 3, name: 'test3', createAt: '10:30:59+07', updateAt: null },
    ]),

    findOne: jest.fn().mockImplementation(() => {
      return {
        id: 1,
        name: 'test1',
        createAt: '10:30:59+07',
        updateAt: '10:30:59+07',
        createdId: 1,
      };
    }),
    update: jest.fn().mockImplementation((id, dto) => ({
      id,
      ...dto,
    })),
    delete: jest.fn().mockImplementation((id) => 'Todo has been delete'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [TodoService],
    })
      .overrideProvider(TodoService)
      .useValue(mockTodoService)
      .compile();
    controller = module.get<TodoController>(TodoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be create a todo', async () => {
    expect(await controller.insertOne(dto)).toEqual({
      id: expect.any(Number),
      ...dto,
    });
  });

  it('should get array of todo', async () => {
    await expect(controller.findAll()).resolves.toEqual([
      { todoId: 1, name: 'test1', createAt: '10:30:59+07', updateAt: null },
      { todoId: 2, name: 'test2', createAt: '10:30:59+07', updateAt: null },
      { todoId: 3, name: 'test3', createAt: '10:30:59+07', updateAt: null },
    ]);
  });

  it('should get a single todo', async () => {
    expect(await controller.findOne(1)).toEqual({
      id: expect.any(Number),
      ...dto,
    });
  });

  it('should update a todo', async () => {
    expect(await controller.update(1, dto)).toEqual({
      id: expect.any(Number),
      ...dto,
    });

    expect(mockTodoService.update).toHaveBeenCalled();
  });
  it('should delete a todo', async () => {
    expect(await controller.delete(1234)).toMatch('Todo has been delete');
  });
});
