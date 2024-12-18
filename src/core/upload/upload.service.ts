import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as AWS from 'aws-sdk';

@Injectable()
export class UploadService {
	private s3: AWS.S3;

	constructor(configService: ConfigService) {
		this.s3 = new AWS.S3({
			accessKeyId: configService.get('s3.accessKeyId'),
			secretAccessKey: configService.get('s3.secretAccessKey'),
			region: configService.get('s3.region'),
		});
	}

	public async uploadToS3(
		file: Express.Multer.File,
	): Promise<AWS.S3.ManagedUpload.SendData> {
		const params = {
			Bucket: 'your-aws-s3-bucket',
			Key: file.originalname,
			Body: file.buffer,
			ContentType: file.mimetype,
		};

		return this.s3.upload(params).promise();
	}
}
