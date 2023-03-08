import { IsEmpty, IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
  @IsEmpty()
  id: number;
  @IsNotEmpty()
  name: string;
}
