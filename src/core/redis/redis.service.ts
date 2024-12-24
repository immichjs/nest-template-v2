import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
	@Inject(CACHE_MANAGER) private readonly cacheManager: Cache;

	public async set(key: string, value: string, ttl?: number): Promise<void> {
		await this.cacheManager.set(key, value, ttl);
	}

	public async get(key: string): Promise<string> {
		return this.cacheManager.get(key);
	}

	public async delete(key: string): Promise<void> {
		await this.cacheManager.del(key);
	}
}
