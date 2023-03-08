import { SetMetadata } from '@nestjs/common';
// import { RoleEnum } from '../role/enum/role.enum';

export const HasRoles = (...roles: Array<string>) =>
  SetMetadata('roles', roles);
