import { IsEmpty, IsNotEmpty } from 'class-validator';
import { RoleEnum } from '../../role/enum/role.enum';

export class CreateUserDto {
  @IsEmpty()
  id: number;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  password: string;
}
