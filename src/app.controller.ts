import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { HasRoles } from './auth/has-roles.decorator';
import { RoleEnum } from './role/enum/role.enum';
import { RolesGuard } from './auth/roles.guard';

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
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  @HasRoles('User')
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
