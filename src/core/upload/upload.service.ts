import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
	private s3Client: S3Client;

	constructor(configService: ConfigService) {
		this.s3Client = new S3Client({
			region: configService.get('s3.region'),
			credentials: {
				accessKeyId: configService.get('s3.accessKeyId'),
				secretAccessKey: configService.get('s3.secretAccessKey'),
			},
		});
	}

	public async uploadToS3(file: Express.Multer.File): Promise<any> {
		const params = {
			Bucket: 'your-aws-s3-bucket',
			Key: file.originalname,
			Body: file.buffer,
			ContentType: file.mimetype,
		};

		const command = new PutObjectCommand(params);

		try {
			const data = await this.s3Client.send(command);
			return data;
		} catch (err) {
			throw err;
		}
	}
}
