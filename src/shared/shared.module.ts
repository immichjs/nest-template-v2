import { Module } from '@nestjs/common';
import { WinstonLoggerService } from './utils/winston-logger.service';

@Module({
	providers: [WinstonLoggerService],
	exports: [WinstonLoggerService],
})
export class SharedModule {}
