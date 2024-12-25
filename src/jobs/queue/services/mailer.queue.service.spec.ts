import { Test, TestingModule } from '@nestjs/testing';
import { MailerQueueService } from './mailer.queue.service';

describe('MailerQueueService', () => {
	let service: MailerQueueService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [MailerQueueService],
		}).compile();

		service = module.get<MailerQueueService>(MailerQueueService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
