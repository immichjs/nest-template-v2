import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
	@ApiProperty({
		description: 'Descrição da notificação',
		type: String,
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	description: string;
}
