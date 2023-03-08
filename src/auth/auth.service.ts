import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AssignRoleService } from '../role/role.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private roleService: AssignRoleService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    const check = await bcrypt.compare(password, user.password);
    if (user && check) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const roles = [];
    const permissions = [];
    const todos = [];
    user.roles.forEach((role) => {
      roles.push(role.name);
      role.rolesHasPermissions.forEach((p) =>
        permissions.push(p.permission.name),
      );
    });
    user.usersHasTodos.forEach((todo) => todos.push(todo.todoId));

    const payload = {
      username: user.name,
      sub: user.uid,
      roles: roles,
      todos: todos,
      permissions: permissions,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
