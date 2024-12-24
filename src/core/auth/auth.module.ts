import { NotificationModule } from '@core/notification/notification.module';
import { OtpModule } from '@core/otp/otp.module';
import { RevokedTokensModule } from '@core/revoked-tokens/revoked-tokens.module';
import { UsersModule } from '@core/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '@shared/shared.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				global: true,
				secret: configService.get('jwt.secret'),
				signOptions: {
					expiresIn: '1h',
				},
			}),
		}),
		SharedModule,
		OtpModule,
		UsersModule,
		RevokedTokensModule,
		NotificationModule,
		JobsModule,
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
