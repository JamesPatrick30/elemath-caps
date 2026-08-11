import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CookieNames } from '../../types/cookie'

const cookieName = CookieNames.accessToken;

@Injectable()
export class AccessStudentsStrategy extends PassportStrategy(Strategy, 'access-students') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => {
        let data = null;
        if (req && req.cookies) {
          data = req.cookies[cookieName];
        }
        return data;
      }]),
      secretOrKey: process.env.ACCESS_JWT_SECRET as string,
    });
  }

  async validate(payload: any) {
    if(payload.role !== 'student') {
      throw new UnauthorizedException('Unauthorized');
    }
    return { sub: payload.sub, email: payload.email, role: payload.role, classId: payload?.classId };
  }
}