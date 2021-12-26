import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { WS_ROLES_KEY } from './ws-roles.decorator';
import { UsersEntity } from '../../users/users.entity';
import { CommentsService } from '../../news/comments/comments.service';

@Injectable()
export class WsRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly commentsService: CommentsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      WS_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const client = context.switchToWs().getClient();
    const authToken: string =
      client.handshake.headers.authorization.split(' ')[1];

    let user: UsersEntity;
    try {
      user = await this.authService.verify(authToken);
    } catch (e) {
      return false;
    }

    if (requiredRoles.some((role) => user.roles === role)) {
      return true;
    }

    const commentObj: { idComment: number } = context.getArgs()[1];

    const comment = await this.commentsService.findById(commentObj.idComment);
    if (comment.user.id === user.id) {
      return true;
    }

    return false;
  }
}
