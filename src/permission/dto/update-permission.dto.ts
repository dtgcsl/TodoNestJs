import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionDto } from './create-permission.dto';
import { IsEmpty, IsNotEmpty } from 'class-validator';

export class UpdatePermissionDto {
  @IsEmpty()
  id: number;
  @IsNotEmpty()
  name: string;
}
