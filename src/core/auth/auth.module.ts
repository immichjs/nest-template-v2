import { NotificationModule } from '@core/notification/notification.module';
import { RevokedTokensModule } from '@core/revoked-tokens/revoked-tokens.module';
import { UsersModule } from '@core/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

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
		UsersModule,
		RevokedTokensModule,
		NotificationModule,
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
