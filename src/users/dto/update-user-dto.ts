import { RoleEnum } from '../../role/enum/role.enum';
import { IsEmpty } from 'class-validator';

export class UpdateUserDto {
  name: string;
  password: string;
}
