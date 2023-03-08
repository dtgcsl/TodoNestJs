import { IsEmpty, IsEnum, IsIn, IsNotEmpty } from 'class-validator';
import { RoleEnum } from '../enum/role.enum';

export class AssignRoleDto {
  @IsNotEmpty()
  uid: number;
  @IsNotEmpty()
  @IsEnum(RoleEnum)
  role: RoleEnum;
}
