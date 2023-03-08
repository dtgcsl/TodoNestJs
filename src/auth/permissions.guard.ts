import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../role/enum/role.enum';
import { JwtStrategy } from './jwt.strategy';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PermissionEnum } from '../permission/enum/permission.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionEnum[]
    >('permissions', [context.getHandler(), context.getClass()]);
    if (!requiredPermissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('Permission -------------', user);
    console.log('*******************************');
    return requiredPermissions.some((permission) =>
      user?.permissions?.includes(permission),
    );
  }
}
