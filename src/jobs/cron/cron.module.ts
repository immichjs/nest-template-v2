import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SharedModule } from '@shared/shared.module';
import { CronService } from './cron.service';

@Module({
	imports: [ScheduleModule.forRoot(), SharedModule],
	providers: [CronService],
})
export class CronModule {}
