import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { WS_ROLES_KEY } from './ws-roles.decorator';

@Injectable()
export class WsRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      WS_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    console.log('WsRoles', requiredRoles);

    if (!requiredRoles) {
      return true;
    }
    const client = context.switchToWs().getClient();
    const authToken: string =
      client.handshake.headers.authorization.split(' ')[1];

    try {
      const user = await this.authService.verify(authToken);
      return requiredRoles.some((role) => user.roles === role);
    } catch (e) {
      return false;
    }
  }
}
