import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { HasRoles } from './auth/decorator/has-roles.decorator';
import { RoleEnum } from './role/enum/role.enum';
import { RolesGuard } from './auth/roles.guard';
import { PermissionsGuard } from './auth/permissions.guard';
import { PermissionEnum } from './permission/enum/permission.enum';
import { RequirePermissions } from './auth/decorator/permission.decorator';
import { OwnersGuard } from './auth/owners.guard';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(RolesGuard, PermissionsGuard, OwnersGuard)
  @UseGuards(AuthGuard('jwt'))
  @HasRoles('User', 'Admin')
  // @ts-ignore
  @RequirePermissions(PermissionEnum[2])
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
