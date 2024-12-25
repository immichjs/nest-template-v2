import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueConfig } from './queue.config';
import { MailModule } from '@core/mail/mail.module';
import { MailerConsumer } from './consumers/mailer.consumer';
import { MailerQueueService } from './services/mailer.queue.service';

@Module({
	imports: [
		BullModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				connection: {
					host: configService.get('redis.host'),
					port: configService.get('redis.port'),
				},
			}),
		}),
		BullModule.registerQueue({ name: QueueConfig.MAILER }),
		MailModule,
	],
	providers: [MailerConsumer, MailerQueueService],
	exports: [MailerQueueService],
})
export class QueueModule {}
