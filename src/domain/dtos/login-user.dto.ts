import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
	@ApiProperty({
		description: 'E-mail do usuário',
		type: String,
		required: true,
	})
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		description: 'Senha do usuário',
		type: String,
		required: true,
	})
	@IsNotEmpty()
	password: string;
}
