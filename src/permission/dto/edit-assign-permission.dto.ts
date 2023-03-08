import { IsNotEmpty } from 'class-validator';

export class EditAssignPermissionDto {
  @IsNotEmpty()
  rid: Array<number>;
  @IsNotEmpty()
  permissionId: number;
}
