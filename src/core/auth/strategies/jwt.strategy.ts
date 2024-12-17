import { jwtConfig } from '@config/jwt.config';
import { IJWTPayload } from '@domain/interfaces/jwt-payload.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@Inject(jwtConfig.KEY)
		jwtConfigConstraint: ConfigType<typeof jwtConfig>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtConfigConstraint.secret,
		});
	}

	public async validate(payload: IJWTPayload) {
		return payload;
	}
}
