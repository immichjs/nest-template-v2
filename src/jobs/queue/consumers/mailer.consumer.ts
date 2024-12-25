import { MailService } from '@core/mail/mail.service';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { QueueConfig } from '../queue.config';

@Processor(QueueConfig.MAILER)
export class MailerConsumer extends WorkerHost {
	@Inject() private readonly mailService: MailService;

	public async process(job: Job<ISendMailOptions>) {
		await this.mailService.sendMail(job.data);
	}
}
