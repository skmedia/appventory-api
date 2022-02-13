import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(payload: any) {
    //console.log('payload', payload);

    const user = await this.authService.validateUserFromJwt(
      payload.sub,
      payload.account,
    );

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
