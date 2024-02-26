import { SetMetadata } from '@nestjs/common';
import { GameRole, Role } from '../enums/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: (Role | GameRole)[]) =>
  SetMetadata(ROLES_KEY, roles);
