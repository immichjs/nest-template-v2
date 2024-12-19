import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WinstonLoggerService } from '@shared/utils/winston-logger.service';

@Injectable()
export class CronService {
	@Inject() private readonly logger: WinstonLoggerService;

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	public handleCron() {
		this.logger.log('Called when the current second is 30');
	}
}
