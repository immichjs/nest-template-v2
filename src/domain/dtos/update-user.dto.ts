import { IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDTO {
	@IsOptional()
	name: string;

	@IsOptional()
	@IsEmail()
	email: string;

	@IsOptional()
	password: string;
}
