import { RedisService } from '@core/redis/redis.service';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { InvalidTokenException } from '@shared/exceptions/invalid-token.exception';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
	constructor(
		private readonly redisService: RedisService,
		private readonly jwtService: JwtService,
	) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const authorization = request.headers.authorization;

		if (!authorization || !authorization.startsWith('Bearer ')) {
			throw new InvalidTokenException();
		}

		const token = authorization.split(' ')[1];

		try {
			const decoded = await this.jwtService.verifyAsync(token);
			const isRevoked = await this.redisService.get(token);

			if (isRevoked === 'revoked') {
				throw new InvalidTokenException();
			}

			request.user = decoded;

			return true;
		} catch (err) {
			throw new InvalidTokenException();
		}
	}
}
