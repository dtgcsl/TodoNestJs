import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';
import { RoleEnum } from '../../role/enum/role.enum';

export class CreateUserDto {
  @IsEmpty()
  id: number;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
