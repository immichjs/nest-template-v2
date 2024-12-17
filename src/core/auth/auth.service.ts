import { ConflictUserException } from '@common/exceptions/conflict-user.exceptions';
import { IncorrectCredentialsException } from '@common/exceptions/incorrect-credentials.exception';
import { UserNotFoundException } from '@common/exceptions/user-not-found.exception';
import { RevokedTokensService } from '@core/revoked-tokens/revoked-tokens.service';
import { UsersService } from '@core/users/users.service';
import { LoginUserDTO } from '@domain/dtos/auth/login-user.dto';
import { RegisterUserDTO } from '@domain/dtos/auth/register-user.dto';
import { User } from '@domain/entities/user';
import { IJWTAccessData } from '@domain/interfaces/jwt-access-data.interface';
import { IJWTPayload } from '@domain/interfaces/jwt-payload.interface';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	@Inject() private readonly usersService: UsersService;
	@Inject() private readonly jwtService: JwtService;
	@Inject() private readonly revokedTokensService: RevokedTokensService;

	public async register(data: RegisterUserDTO): Promise<IJWTAccessData> {
		const userAlreadyExists = await this.usersService.findOne({
			email: data.email,
		});

		if (userAlreadyExists) {
			throw new ConflictUserException();
		}

		const user = await this.usersService.create(data);
		return this.generateTokens(user);
	}

	public async login(data: LoginUserDTO): Promise<IJWTAccessData> {
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

		return this.generateTokens(user);
	}

	public async logout(token: string): Promise<void> {
		return this.revokedTokensService.revokeToken(token);
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
