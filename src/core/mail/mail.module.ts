import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				transport: {
					host: configService.get('mail.host'),
					port: configService.get('mail.port'),
					auth: {
						user: configService.get('mail.user'),
						pass: configService.get('mail.pass'),
					},
				},
				defaults: {
					from: `"Ronny Wyman" <${configService.get('mail.user')}>`,
				},
			}),
		}),
	],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
