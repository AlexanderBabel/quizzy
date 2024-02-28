import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  findJwtToken(req: any): string | null {
    const token = req?.handshake?.auth?.token;
    if (token) {
      return token;
    }

    const headers = req?.headers || req?.handshake?.headers;
    if (!headers) {
      return null;
    }
    const parts = headers['authorization']?.split(' ') || [];
    if (parts[0]?.toLowerCase() !== 'bearer' || parts.length !== 2) {
      return null;
    }
    return parts[1];
  }
}
