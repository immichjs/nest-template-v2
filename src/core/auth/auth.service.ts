import { NotificationService } from '@core/notification/notification.service';
import { RevokedTokensService } from '@core/revoked-tokens/revoked-tokens.service';
import { UsersService } from '@core/users/users.service';
import { LoginUserDto } from '@domain/dtos/login-user.dto';
import { RegisterUserDto } from '@domain/dtos/register-user.dto';
import { User } from '@domain/entities/user';
import { IJWTAccessData } from '@domain/interfaces/jwt-access-data.interface';
import { IJWTPayload } from '@domain/interfaces/jwt-payload.interface';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConflictUserException } from '@shared/exceptions/conflict-user.exceptions';
import { IncorrectCredentialsException } from '@shared/exceptions/incorrect-credentials.exception';
import { InvalidTokenException } from '@shared/exceptions/invalid-token.exception';
import { UserNotFoundException } from '@shared/exceptions/user-not-found.exception';
import { WinstonLoggerService } from '@shared/utils/winston-logger.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	@Inject() private readonly usersService: UsersService;
	@Inject() private readonly jwtService: JwtService;
	@Inject() private readonly revokedTokensService: RevokedTokensService;
	@Inject() private readonly notificationService: NotificationService;
	@Inject() private readonly logger: WinstonLoggerService;

	public async register(data: RegisterUserDto): Promise<IJWTAccessData> {
		const userAlreadyExists = await this.usersService.findOne({
			email: data.email,
		});

		if (userAlreadyExists) {
			throw new ConflictUserException();
		}

		const user = await this.usersService.create(data);
		return this.generateTokens(user);
	}

	public async login(data: LoginUserDto): Promise<IJWTAccessData> {
		const user = await this.usersService.findOne({ email: data.email });
		const userNotFound = !user;

		if (userNotFound) {
			throw new UserNotFoundException();
		}

		const comparedHashIsNotValid = !(await bcrypt.compare(
			data.password,
			user.password,
		));
		if (comparedHashIsNotValid) {
			throw new IncorrectCredentialsException();
		}

		await this.notificationService.create({
			description: `${user.name}(${user.email}) logou no sistema.`,
		});

		this.logger.log(JSON.stringify(user));
		return this.generateTokens(user);
	}

	public async logout(token: string): Promise<void> {
		return this.revokedTokensService.revokeToken(token);
	}

	public async refresh(refreshToken: string): Promise<IJWTAccessData> {
		try {
			const decoded = this.jwtService.verify(refreshToken, {
				issuer: 'refresh',
			});
			const user = await this.usersService.findOne({ id: decoded.id });

			if (!user) {
				throw new UserNotFoundException();
			}

			return this.generateTokens(user);
		} catch (error) {
			throw new InvalidTokenException();
		}
	}

	private generateTokens(user: User): IJWTAccessData {
		const payload: IJWTPayload = {
			id: user.id,
			email: user.email,
		};

		return {
			accessToken: this.jwtService.sign(payload),
			refreshToken: this.jwtService.sign(payload, {
				expiresIn: '7d',
				issuer: 'refresh',
			}),
		};
	}
}
