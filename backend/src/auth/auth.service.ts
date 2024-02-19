import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  findJwtToken(req: any): string | null {
    const headers = req?.headers || req?.handshake?.headers;
    if (!headers) {
      return null;
    }
    const parts = headers['authorization'].split(' ');
    if (parts[0]?.toLowerCase() !== 'bearer' || parts.length !== 2) {
      return null;
    }
    return parts[1];
  }

  findUser(ctx: ExecutionContext) {
    return ctx?.getArgs()[0]?.user;
  }
}
