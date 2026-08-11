import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CookieNames } from '../../types/cookie'

const cookieName = CookieNames.refreshToken;

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => {
        let data = null;
        if (req && req.cookies) {
          data = req.cookies[cookieName];
        }
        return data;
      }]),
      secretOrKey: process.env.REFRESH_JWT_SECRET as string,
    });
  }

  async validate(payload: any) {

    return { sub: payload.sub, email: payload.email, role: payload.role, classId: payload?.classId };
  }
}