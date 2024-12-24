import { NotificationService } from '@core/notification/notification.service';
import { OtpService } from '@core/otp/otp.service';
import { RevokedTokensService } from '@core/revoked-tokens/revoked-tokens.service';
import { UsersService } from '@core/users/users.service';
import { ChangePasswordDto } from '@domain/dtos/change-password.dto';
import { LoginUserDto } from '@domain/dtos/login-user.dto';
import { RegisterUserDto } from '@domain/dtos/register-user.dto';
import { ResetPasswordDto } from '@domain/dtos/reset-password.dto';
import { ValidateResetDto } from '@domain/dtos/validate-reset.dto';
import { User } from '@domain/entities/user';
import { IJWTAccessData } from '@domain/interfaces/jwt-access-data.interface';
import { IJWTPayload } from '@domain/interfaces/jwt-payload.interface';
import { IJwtResetData } from '@domain/interfaces/jwt-reset-data.interface';
import { IResetResponse } from '@domain/interfaces/reset-response.interface';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConflictUserException } from '@shared/exceptions/conflict-user.exceptions';
import { IncorrectCredentialsException } from '@shared/exceptions/incorrect-credentials.exception';
import { InvalidOTPException } from '@shared/exceptions/invalid-otp.exception';
import { InvalidTokenException } from '@shared/exceptions/invalid-token.exception';
import { UserNotFoundException } from '@shared/exceptions/user-not-found.exception';
import { WinstonLoggerService } from '@shared/utils/winston-logger.service';
import * as bcrypt from 'bcrypt';
import { Job } from 'bullmq';
import { MailerQueueService } from 'src/jobs/queues/services/mailer.queue.service';

@Injectable()
export class AuthService {
	@Inject() private readonly usersService: UsersService;
	@Inject() private readonly jwtService: JwtService;
	@Inject() private readonly revokedTokensService: RevokedTokensService;
	@Inject() private readonly notificationService: NotificationService;
	@Inject() private readonly otpService: OtpService;
	@Inject() private readonly logger: WinstonLoggerService;
	@Inject() private readonly mailerQueueService: MailerQueueService;

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

	public async reset(data: ResetPasswordDto): Promise<IResetResponse> {
		const user = await this.usersService.findOne({ email: data.email });

		if (user) {
			const key = `reset:${user.id}`;
			const otp = await this.otpService.saveOTP(key);

			await this.mailerQueueService.execute({
				context: {
					name: user.name,
					email: user.email,
					otp,
				},
			});
		}

		return {
			message:
				'Se a conta existir, enviaremos um código de segurança em breve.',
		};
	}

	public async validateReset(data: ValidateResetDto): Promise<IJwtResetData> {
		const user = await this.usersService.findOne({ email: data.email });

		if (!user) {
			throw new UserNotFoundException();
		}

		const key = `reset:${user.id}`;
		const otpIsValid = await this.otpService.validate(key, data.otp);

		if (!otpIsValid) {
			throw new InvalidOTPException();
		}

		await this.otpService.removeOTP(key);

		return this.genereteResetToken(user);
	}

	public async changePassword(
		resetToken: string,
		data: ChangePasswordDto,
	): Promise<IJWTAccessData> {
		try {
			const decoded = this.jwtService.verify(resetToken, {
				issuer: 'reset',
			});
			const user = await this.usersService.findOne({ id: decoded.id });

			if (!user) {
				throw new UserNotFoundException();
			}

			const updatedUser = await this.usersService.update(user.id, {
				password: data.password,
			});

			await this.revokedTokensService.revokeToken(resetToken);

			return this.generateTokens(updatedUser);
		} catch (error) {
			throw new InvalidTokenException();
		}
	}

	private genereteResetToken(user: User): IJwtResetData {
		const payload: IJWTPayload = {
			id: user.id,
			email: user.email,
		};

		const resetToken = this.jwtService.sign(payload, {
			expiresIn: '5m',
			issuer: 'reset',
		});

		return { resetToken };
	}

	private generateTokens(user: User): IJWTAccessData {
		const payload: IJWTPayload = {
			id: user.id,
			email: user.email,
		};

		const accessToken = this.jwtService.sign(payload);
		const refreshToken = this.jwtService.sign(payload, {
			expiresIn: '7d',
			issuer: 'refresh',
		});

		return {
			accessToken,
			refreshToken,
		};
	}
}
