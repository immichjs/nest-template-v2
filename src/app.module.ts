import { databaseConfig } from '@config/database.config';
import { jwtConfig } from '@config/jwt.config';
import { redisConfig } from '@config/redis.config';
import { s3Config } from '@config/s3.config';
import { DatabaseModule } from '@infra/database/database.module';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedModule } from '@shared/shared.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { NotificationModule } from './core/notification/notification.module';
import { OtpModule } from './core/otp/otp.module';
import { UploadModule } from './core/upload/upload.module';
import { UsersModule } from './core/users/users.module';
import { CronModule } from './jobs/cron/cron.module';
import { RedisModule } from '@core/redis/redis.module';
import { MailModule } from './core/mail/mail.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [databaseConfig, jwtConfig, redisConfig, s3Config],
		}),
		DatabaseModule,
		RedisModule,
		UsersModule,
		AuthModule,
		UploadModule,
		NotificationModule,
		OtpModule,
		SharedModule,
		MailModule,
		JobsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
