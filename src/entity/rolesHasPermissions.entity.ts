import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Table,
  ViewEntity,
} from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Entity({ name: 'rolesHasPermissions' })
export class RolesHasPermissions {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('int')
  rid: number;
  @Column('int')
  permissionId: number;
  @ManyToOne(() => Role, (role) => role.rolesHasPermissions)
  @JoinColumn({ name: 'rid' })
  role: Role;
  @ManyToOne(() => Permission, (permission) => permission.rolesHasPermissions)
  @JoinColumn({ name: 'permissionId', referencedColumnName: 'id' })
  permission: Permission;
}
