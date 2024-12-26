import { NotificationModule } from '@core/notification/notification.module';
import { OtpModule } from '@core/otp/otp.module';
import { UsersModule } from '@core/users/users.module';
import { Global, Module } from '@nestjs/common';
import { SharedModule } from '@shared/shared.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JobsModule } from '@jobs/jobs.module';
import { RedisModule } from '@core/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
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
					issuer: 'auth',
				},
			}),
		}),
		SharedModule,
		OtpModule,
		UsersModule,
		NotificationModule,
		RedisModule,
		JobsModule,
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	exports: [JwtModule],
})
export class AuthModule {}
