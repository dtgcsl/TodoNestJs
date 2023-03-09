import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { Todo } from './todo.entity';

@Entity({ name: 'usersHasTodos' })
export class UsersHasTodos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  todoId: number;
  @Column('int')
  uid: number;

  @ManyToOne(() => Users, (users) => users.usersHasTodos)
  @JoinColumn({ name: 'uid' })
  users: Users;

  @ManyToOne(() => Todo, (todo) => todo.usersHasTodos)
  @JoinColumn({ name: 'todoId' })
  todo: Todo;
}
