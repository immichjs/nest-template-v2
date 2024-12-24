import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
	@Inject() private readonly mailerService: MailerService;

	public async sendMail(data: ISendMailOptions) {
		this.mailerService.sendMail({
			to: `${data.context.name} <${data.context.email}>`,
			subject: `Nest.js Template (OTP): ${data.context.otp}`,
			html: `<h1>${data.context.otp}</h1>`,
		});
	}
}
