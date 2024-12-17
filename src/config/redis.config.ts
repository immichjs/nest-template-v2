import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs('redis', () => ({
	host: process.env.REDIS_HOST || 'localhost',
	port: parseInt(process.env.REDIS_PORT, 10) || 6379,
	username: process.env.REDIS_USERNAME,
	password: process.env.REDIS_PASSWORD,
}));
