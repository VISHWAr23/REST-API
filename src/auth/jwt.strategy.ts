import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable} from '@nestjs/common';
import { jwtSecret } from './utils/constants';
import { Request } from 'express';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
        jwtFromRequest: ExtractJwt.fromExtractors([
            JwtStrategy.extractJWT,
        ]),
        secretOrKey: jwtSecret as string
    });
  }

  private static extractJWT(req : Request): string | null{
    if(req.headers && 'authorization' in req.headers){
        const authHeader = req.headers.authorization;
        return authHeader ? authHeader.replace('Bearer ', '') : null;
    }
    return null;
  }

  async validate(payload : { id : string, role : string}){
      return payload;
  }
}