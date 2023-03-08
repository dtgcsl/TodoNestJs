import { IsEmpty, IsNotEmpty } from 'class-validator';
import { extend } from '@nestjs/graphql';
import { ITodo } from '../interface/todo.interface';

export class CreateTodoDto implements ITodo {
  @IsEmpty()
  id: number;
  @IsNotEmpty()
  name: string;
  createAt: string;
  updateAt: string;
  createdId: number;
}

//post
//delete
//edit
