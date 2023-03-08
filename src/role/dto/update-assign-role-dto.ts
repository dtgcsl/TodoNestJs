import { IsNotEmpty } from 'class-validator';
import { RoleEnum } from '../enum/role.enum';

export class UpdateAssignRoleDto {
  @IsNotEmpty()
  uid: number;
  @IsNotEmpty()
  role: Array<RoleEnum>;
}
