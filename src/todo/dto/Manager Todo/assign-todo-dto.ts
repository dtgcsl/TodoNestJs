import { IsEmpty, IsNotEmpty } from 'class-validator';

export class AssignTodoDto {
  @IsEmpty()
  id: number;
  @IsNotEmpty()
  todoId: number;
  @IsNotEmpty()
  uid: number;
}
