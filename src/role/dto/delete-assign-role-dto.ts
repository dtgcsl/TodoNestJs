import { IsEnum, IsNotEmpty } from 'class-validator';
import { RoleEnum } from '../enum/role.enum';

export class DeleteAssignRoleDto {
  @IsNotEmpty()
  uid: number;
  @IsNotEmpty()
  @IsEnum(RoleEnum)
  role: RoleEnum;
}
