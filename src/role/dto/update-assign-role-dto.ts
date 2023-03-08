import { IsNotEmpty, MaxLength } from 'class-validator';
import { RoleEnum } from '../enum/role.enum';

export class UpdateAssignRoleDto {
  @IsNotEmpty()
  uid: number;
  @IsNotEmpty({ each: true })
  role: Array<RoleEnum>;
}
