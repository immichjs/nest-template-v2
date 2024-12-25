import { Module } from '@nestjs/common';
import { QueueModule } from './queue/queue.module';
import { CronModule } from './cron/cron.module';

@Module({
	imports: [QueueModule, CronModule],
	exports: [QueueModule, CronModule],
})
export class JobsModule {}
