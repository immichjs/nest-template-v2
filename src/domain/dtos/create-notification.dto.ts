import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDTO {
	@IsNotEmpty()
	@IsString()
	description: string;
}
