import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
	@ApiProperty({
		description: 'Nome do usuário',
		type: String,
		required: false,
	})
	@IsOptional()
	name: string;

	@ApiProperty({
		description: 'E-mail do usuário',
		type: String,
		required: false,
	})
	@IsOptional()
	@IsEmail()
	email: string;

	@ApiProperty({
		description: 'Senha do usuário',
		type: String,
		required: false,
	})
	@IsOptional()
	password: string;
}
