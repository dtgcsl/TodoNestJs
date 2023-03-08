import { SetMetadata } from '@nestjs/common';
import { Permission } from '../entity/permission.entity';

export const PERMISSION_KEY = 'permissions';
export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSION_KEY, permissions);
