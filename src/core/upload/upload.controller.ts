import {
	Controller,
	Inject,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
	@Inject() private readonly uploadService: UploadService;

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	public async uploadToS3(@UploadedFile() file: Express.Multer.File) {
		return this.uploadService.uploadToS3(file);
	}
}