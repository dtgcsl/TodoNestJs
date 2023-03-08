import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Users } from './users.entity';
import { RoleEnum } from '../role/enum/role.enum';
import { RolesHasPermissions } from './rolesHasPermissions.entity';
import { IsEnum } from 'class-validator';

@Entity({ name: 'role' })
export class Role {
  @PrimaryGeneratedColumn()
  rid: number;
  @Column({ type: 'varchar', nullable: false })
  @IsEnum(RoleEnum)
  name: string;
  @Column('int')
  uid: number;
  @ManyToOne(() => Users, (users) => users.uid)
  @JoinColumn({ name: 'uid' })
  users: Users;
  @OneToMany(
    () => RolesHasPermissions,
    (rolesHasPermissions) => rolesHasPermissions.role,
  )
  rolesHasPermissions: RolesHasPermissions[];
}
