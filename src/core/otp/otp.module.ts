import { RedisModule } from '@core/redis/redis.module';
import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';

@Module({
	imports: [RedisModule],
	controllers: [OtpController],
	providers: [OtpService],
	exports: [OtpService],
})
export class OtpModule {}
