import { RoleEnum } from '../../role/enum/role.enum';
import { IsEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsEmpty()
  id: number;
  name: string;
  pass: string;
}
