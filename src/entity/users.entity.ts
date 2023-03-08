import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UsersHasTodos } from './usersHasTodos.entity';
import { Role } from './role.entity';

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn()
  uid: number;
  @Column('varchar')
  name: string;
  @Column({ type: 'varchar', select: false })
  password: string;

  @OneToMany(() => UsersHasTodos, (usersHasTodos) => usersHasTodos.users)
  usersHasTodos: UsersHasTodos[];

  @OneToMany(() => Role, (role) => role.users)
  roles: Role[];
}
