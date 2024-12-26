import { registerAs } from '@nestjs/config';

export const mailConfig = registerAs('mail', () => ({
	host: process.env.SMTP_HOST,
	port: parseInt(process.env.SMTP_PORT, 10),
	user: process.env.SMTP_USER,
	pass: process.env.SMTP_PASS,
}));
