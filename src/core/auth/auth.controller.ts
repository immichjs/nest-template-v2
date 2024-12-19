import { LoginUserDto } from '@domain/dtos/login-user.dto';
import { RegisterUserDto } from '@domain/dtos/register-user.dto';
import { IJWTAccessData } from '@domain/interfaces/jwt-access-data.interface';
import {
	Body,
	Controller,
	Headers,
	Inject,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@shared/guards/jwt.guard';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
	@Inject() private readonly authService: AuthService;

	@Post('register')
	public async register(
		@Body() data: RegisterUserDto,
	): Promise<IJWTAccessData> {
		return this.authService.register(data);
	}

	@Post('login')
	public async login(@Body() data: LoginUserDto): Promise<IJWTAccessData> {
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
