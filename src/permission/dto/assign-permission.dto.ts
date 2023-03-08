import { IsNotEmpty } from 'class-validator';

export class AssignPermissionDto {
  @IsNotEmpty()
  rid: number;
  @IsNotEmpty()
  permissionId: number;
}
