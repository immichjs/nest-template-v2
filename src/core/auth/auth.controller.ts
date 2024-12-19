import { JwtGuard } from '@common/guards/jwt.guard';
import { LoginUserDTO } from '@domain/dtos/login-user.dto';
import { RegisterUserDTO } from '@domain/dtos/register-user.dto';
import { IJWTAccessData } from '@domain/interfaces/jwt-access-data.interface';
import {
	Body,
	Controller,
	Headers,
	Inject,
	Post,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	@Inject() private readonly authService: AuthService;

	@Post('register')
	public async register(
		@Body() data: RegisterUserDTO,
	): Promise<IJWTAccessData> {
		return this.authService.register(data);
	}

	@Post('login')
	public async login(@Body() data: LoginUserDTO): Promise<IJWTAccessData> {
		return this.authService.login(data);
	}

	@UseGuards(JwtGuard)
	@Post('logout')
	public async logout(@Headers('authorization') token: string): Promise<void> {
		return this.authService.logout(token);
	}

	@Post('refresh')
	public async refresh(
		@Body('refreshToken') refreshToken: string,
	): Promise<IJWTAccessData> {
		return this.authService.refresh(refreshToken);
	}
}
