import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RolesHasPermissions } from './rolesHasPermissions.entity';

@Entity({ name: 'permission' })
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar')
  name: string;
  @OneToMany(
    () => RolesHasPermissions,
    (rolesHasPermissions) => rolesHasPermissions.permission,
  )
  rolesHasPermissions: RolesHasPermissions[];
}
