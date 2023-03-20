import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Users } from './users.entity';
import { JoinTable } from 'typeorm/browser';
import { UsersHasTodos } from './usersHasTodos.entity';

@Entity({ name: 'todo' })
export class Todo {
  constructor(
    todoId: number,
    name: string,
    createAt: Date,
    updateAt: Date,
    createdById: number,
  ) {
    this.todoId = todoId;
    this.name = name;
    this.createAt = createAt;
    this.updateAt = updateAt;
    this.createdById = createdById;
  }
  @PrimaryGeneratedColumn()
  todoId: number;
  @Column({ type: 'varchar', nullable: false })
  name: string;
  @Column({
    type: 'time with time zone',

    default: () => 'CURRENT_TIME',
  })
  createAt: Date;
  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;
  @Column({
    type: 'varchar',
    nullable: true,
    default: null,
  })
  createdById: number;

  @OneToMany(() => UsersHasTodos, (usersHasTodos) => usersHasTodos.todo, {
    cascade: true,
  })
  usersHasTodos: UsersHasTodos[];
}
