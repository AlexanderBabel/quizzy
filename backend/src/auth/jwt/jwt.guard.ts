import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { GameRole, Role } from './enums/roles.enum';
import { ROLES_KEY } from './decorators/roles.decorator';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const authHeaderPresent = this.authService.findJwtToken(context);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    let result: boolean | Observable<boolean> = true;
    if (!isPublic || authHeaderPresent) {
      result = await super.canActivate(context);
    }

    // Fix for WS connections
    context.getArgs()[0].data = this.authService.findUser(context);

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

    const user = this.authService.findUser(context);
    return requiredRoles.some(
      (role) =>
        user?.role === role ||
        user?.authType === role ||
        (user?.isAdmin === true && role === Role.Admin),
    );
  }
}
