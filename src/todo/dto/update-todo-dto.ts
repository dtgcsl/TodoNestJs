import { IsEmpty, IsNotEmpty } from 'class-validator';

export class UpdateTodoDto {
  @IsEmpty()
  id: number;
  name: string;
  @IsEmpty()
  createAt: string;
  @IsEmpty()
  updateAt: string;
}
