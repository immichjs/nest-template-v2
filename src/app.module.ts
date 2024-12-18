import { databaseConfig } from '@config/database.config';
import { jwtConfig } from '@config/jwt.config';
import { redisConfig } from '@config/redis.config';
import { s3Config } from '@config/s3.config';
import { RedisCacheModule } from '@core/redis-cache/redis-cache.module';
import { RevokedTokensModule } from '@core/revoked-tokens/revoked-tokens.module';
import { DatabaseModule } from '@infra/database/database.module';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { AuthModule } from './core/auth/auth.module';
import { UploadModule } from './core/upload/upload.module';
import { UsersModule } from './core/users/users.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [databaseConfig, jwtConfig, redisConfig, s3Config],
		}),
		CacheModule.registerAsync({
			isGlobal: true,
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				max: 100,
				ttl: 0,
				store: redisStore,
				host: configService.get('redis.host'),
				port: configService.get('redis.port'),
			}),
		}),
		DatabaseModule,
		RedisCacheModule,
		UsersModule,
		AuthModule,
		RevokedTokensModule,
		UploadModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
