import { registerAs } from '@nestjs/config';

export const s3Config = registerAs('s3', () => ({
	accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
	region: process.env.AWS_S3_REGION,
}));
