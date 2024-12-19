import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class WinstonLoggerService implements LoggerService {
	private readonly logger: winston.Logger;

	constructor() {
		this.logger = winston.createLogger({
			level: 'info',
			transports: [
				new winston.transports.Console({
					format: winston.format.combine(
						winston.format.colorize(),
						winston.format.simple(),
					),
				}),
				new winston.transports.File({
					filename: 'logs/application.log',
					level: 'info',
					format: winston.format.combine(
						winston.format.timestamp(),
						winston.format.json(),
					),
				}),
			],
		});
	}

	public log(message: string) {
		this.logger.info(message);
	}

	public error(message: string, trace: string) {
		this.logger.error(message, { trace });
	}

	public warn(message: string) {
		this.logger.warn(message);
	}

	public debug(message: string) {
		this.logger.debug(message);
	}

	public verbose(message: string) {
		this.logger.verbose(message);
	}
}
