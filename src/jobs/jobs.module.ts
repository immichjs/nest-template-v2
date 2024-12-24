import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerQueueService } from './queues/services/mailer.queue.service';
import { MailerConsumer } from './queues/consumers/mailer.consumer';
import { MailModule } from '@core/mail/mail.module';
import { QueueConfig } from './queues/queue.config';

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
export class JobsModule {}
