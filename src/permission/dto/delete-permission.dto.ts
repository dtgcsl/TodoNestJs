import { IsNotEmpty } from 'class-validator';

export class DeleteAssignPermissionDto {
  @IsNotEmpty()
  rid: number;
  @IsNotEmpty()
  permissionId: number;
}
