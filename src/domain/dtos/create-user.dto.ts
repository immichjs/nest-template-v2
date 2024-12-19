import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
	@ApiProperty({
		description: 'Nome do usuário',
		type: String,
		required: true,
	})
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		description: 'E-mail do usuário',
		type: String,
		required: true,
	})
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty({
		description: 'Senha do usuário',
		type: String,
		required: true,
	})
	@IsNotEmpty()
	@MinLength(4)
	@MaxLength(16)
	password: string;
}
