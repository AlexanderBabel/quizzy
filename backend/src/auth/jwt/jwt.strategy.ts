import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { CreatorService } from 'src/model/creator.service';
import { JwtAuthType } from './jwt.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private creatorService: CreatorService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { type?: JwtAuthType; id: number }): Promise<any> {
    let user = {};

    // check auth type and get user data
    switch (payload.type) {
      case JwtAuthType.Creator:
        const creator = await this.creatorService.creator({ id: payload.id });
        if (!creator) {
          return null;
        }
        user = { authType: payload.type, ...creator };
        break;
      case JwtAuthType.Guest:
        user = { authType: payload.type, id: payload.id };
        break;
      default:
        return null;
    }

    // TODO: check for cached data (check if user is a host or a player in a game)

    return user;
  }
}
