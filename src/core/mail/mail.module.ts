import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
	imports: [
		MailerModule.forRoot({
			transport: {
				host: 'smtp.ethereal.email',
				port: 587,
				auth: {
					user: 'ronny.wyman8@ethereal.email',
					pass: 'EHg7rNepRGx3EGryhs',
				},
			},
			defaults: {
				from: '"Ronny Wyman" <ronny.wyman8@ethereal.email>',
			},
		}),
	],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
