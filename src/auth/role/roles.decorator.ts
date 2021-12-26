import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum';
import { WS_ROLES_KEY } from './ws-roles.decorator';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
