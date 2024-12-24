import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';

@Module({
	imports: [
		CacheModule.registerAsync({
			isGlobal: true,
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const store = await redisStore({
					socket: {
						host: configService.get('redis.host'),
						port: configService.get('redis.port'),
					},
				});

				return {
					store: store as unknown as CacheStore,
				};
			},
		}),
	],
	providers: [RedisService],
	exports: [RedisService],
})
export class RedisModule {}
