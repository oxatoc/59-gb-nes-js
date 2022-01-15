import { SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from './role.enum';
import { WsRolesGuard } from './ws-roles.guard';
import { applyDecorators } from '@nestjs/common';

export const WS_ROLES_KEY = 'ws_roles';
export function WsRolesOrUser(...roles: Role[]) {
  return applyDecorators(
    SetMetadata(WS_ROLES_KEY, roles),
    UseGuards(WsRolesGuard),
  );
}
