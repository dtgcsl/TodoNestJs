import { IsNotEmpty } from 'class-validator';

export class UpdateAssignTodoDto {
  @IsNotEmpty()
  todoId: number;
  @IsNotEmpty()
  uid: Array<number>;
}
