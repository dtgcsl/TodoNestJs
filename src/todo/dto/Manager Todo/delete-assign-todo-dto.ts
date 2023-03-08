import { IsNotEmpty } from 'class-validator';

export class DeleteAssignTodoDto {
  @IsNotEmpty()
  uid: number;
  @IsNotEmpty()
  todoId: number;
}
