import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { CreatorService } from 'src/model/creator.service';
import { Creator } from '@prisma/client';

@Injectable()
export class CreatorJwtStrategy extends PassportStrategy(
  Strategy,
  'creator-jwt',
) {
  constructor(private creatorService: CreatorService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<Creator> {
    const creator = await this.creatorService.creator({ id: payload.id });
    if (!creator) {
      return null;
    }
    return creator;
  }
}
