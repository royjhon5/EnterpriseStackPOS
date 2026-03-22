import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  userId: string;
  roleType: string;
  tenantId: number;
  iat: number;
  exp: number;
}

interface JwtConfig {
  secret: string;
  issuer: string;
  audience: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const jwt = config.get<JwtConfig>('jwt');

    if (!jwt) {
      throw new Error('JWT configuration not found');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwt.secret,
      issuer: jwt.issuer,
      audience: jwt.audience,
      ignoreExpiration: false,
    });
  }

  validate(payload: JwtPayload) {
    return {
      userId: payload.userId,
      roleType: payload.roleType,
      tenantId: payload.tenantId,
    };
  }
}
