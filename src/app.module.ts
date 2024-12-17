import { databaseConfig } from '@config/database.config';
import { jwtConfig } from '@config/jwt.config';
import { redisConfig } from '@config/redis.config';
import { RevokedTokensModule } from '@core/revoked-tokens/revoked-tokens.module';
import { DatabaseModule } from '@infra/database/database.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './core/auth/auth.module';
import { UsersModule } from './core/users/users.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [databaseConfig, jwtConfig, redisConfig],
		}),
		DatabaseModule,
		UsersModule,
		AuthModule,
		RevokedTokensModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
