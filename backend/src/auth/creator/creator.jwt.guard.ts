import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CreatorAuthGuard extends AuthGuard('creator-jwt') {}
