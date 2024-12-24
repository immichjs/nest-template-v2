import { RedisService } from '@core/redis/redis.service';
import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
	@Inject() private readonly redisService: RedisService;

	public async saveOTP(key: string): Promise<void> {
		const otp = this.generateOTP(3);
		const ttl = 300 * 1000;
		await this.redisService.set(key, otp, ttl);
	}

	public async validate(key: string, value: string): Promise<boolean> {
		const otp = await this.redisService.get(key);
		return otp === value;
	}

	public async removeOTP(key: string): Promise<void> {
		await this.redisService.delete(key);
	}

	public generateOTP(bytes: number) {
		return crypto.randomBytes(bytes).toString('hex').toUpperCase();
	}
}
