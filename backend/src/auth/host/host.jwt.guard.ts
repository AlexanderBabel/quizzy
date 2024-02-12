import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class HostAuthGuard extends AuthGuard('host-jwt') {}
