import { SetMetadata } from '@nestjs/common';
import { Permission } from '../../entity/permission.entity';

export const TODO_KEY = 'todos';
export const OwnerBy = (...todos: number[]) => SetMetadata(TODO_KEY, todos);
