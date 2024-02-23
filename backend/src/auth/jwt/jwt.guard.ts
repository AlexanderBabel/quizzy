import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { GameRole, Role } from './enums/roles.enum';
import { ROLES_KEY } from './decorators/roles.decorator';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const { headers } = context.switchToHttp().getRequest<Request>();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    let result: boolean | Observable<boolean> = true;
    if (!isPublic || headers['authorization']) {
      result = await super.canActivate(context);
    }

    if (isPublic) {
      return true;
    }

    if (!result) {
      return false;
    }

    const requiredRoles = this.reflector.getAllAndOverride<(Role | GameRole)[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some(
      (role) =>
        user?.authType === role ||
        (user?.isAdmin === true && role === Role.Admin),
    );
  }
}
