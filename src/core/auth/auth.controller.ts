import { ChangePasswordDto } from '@domain/dtos/change-password.dto';
import { LoginUserDto } from '@domain/dtos/login-user.dto';
import { RegisterUserDto } from '@domain/dtos/register-user.dto';
import { ResetPasswordDto } from '@domain/dtos/reset-password.dto';
import { ValidateResetDto } from '@domain/dtos/validate-reset.dto';
import { IJWTAccessData } from '@domain/interfaces/jwt-access-data.interface';
import { IJwtResetData } from '@domain/interfaces/jwt-reset-data.interface';
import { IResetResponse } from '@domain/interfaces/reset-response.interface';
import {
	Body,
	Controller,
	Headers,
	HttpCode,
	HttpStatus,
	Inject,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InvalidTokenException } from '@shared/exceptions/invalid-token.exception';
import { JwtGuard } from '@shared/guards/jwt.guard';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
	@Inject() private readonly authService: AuthService;

	@HttpCode(HttpStatus.CREATED)
	@Post('register')
	public async register(
		@Body() data: RegisterUserDto,
		@Res() response: Response,
	): Promise<Response<Omit<IJWTAccessData, 'refreshToken'>>> {
		const { accessToken, refreshToken } = await this.authService.register(data);

		response.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return response.json({ accessToken });
	}

	@HttpCode(HttpStatus.OK)
	@Post('login')
	public async login(
		@Body() data: LoginUserDto,
		@Res() response: Response,
	): Promise<Response<Omit<IJWTAccessData, 'refreshToken'>>> {
		const { accessToken, refreshToken } = await this.authService.login(data);

		response.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return response.json({ accessToken });
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(JwtGuard)
	@Post('logout')
	public async logout(
		@Headers('authorization') authorization: string,
	): Promise<void> {
		const accessToken = authorization.split(' ')[1];
		return this.authService.logout(accessToken);
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtGuard)
	@Post('refresh')
	public async refresh(
		@Req() request: Request,
		@Res() response: Response,
	): Promise<Response<Omit<IJWTAccessData, 'refreshToken'>>> {
		const refreshTokenCookie = request.cookies['refreshToken'];
		const { accessToken, refreshToken } =
			await this.authService.refresh(refreshTokenCookie);

		response.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return response.json({ accessToken });
	}

	@HttpCode(HttpStatus.OK)
	@Post('reset')
	public async reset(@Body() data: ResetPasswordDto): Promise<IResetResponse> {
		return this.authService.reset(data);
	}

	@HttpCode(HttpStatus.OK)
	@Post('reset/validate')
	public async validateReset(
		@Body() data: ValidateResetDto,
		@Res() response: Response,
	): Promise<Response<Omit<IJwtResetData, 'refreshToken'>>> {
		const { resetToken } = await this.authService.validateReset(data);

		response.cookie('resetToken', resetToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 5 * 60 * 1000,
		});

		return response.json({ resetToken });
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtGuard)
	@Post('reset/password')
	public async changePassword(
		@Body() data: ChangePasswordDto,
		@Req() request: Request,
		@Res() response: Response,
	): Promise<Response<Omit<IJWTAccessData, 'refreshToken'>>> {
		const resetTokenCookie = request.cookies['resetToken'];

		if (!resetTokenCookie) {
			throw new InvalidTokenException();
		}

		const { accessToken, refreshToken } = await this.authService.changePassword(
			resetTokenCookie,
			data,
		);

		response.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return response.json({ accessToken });
	}
}
