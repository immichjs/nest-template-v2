import { ISendMailOptions } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QueueConfig } from '../queue.config';

@Injectable()
export class MailerQueueService {
	constructor(
		@InjectQueue(QueueConfig.MAILER) private readonly mailerQueue: Queue,
	) {}

	public async execute(data: ISendMailOptions) {
		await this.mailerQueue.add(QueueConfig.MAILER, data);
	}
}
