import { Match } from '@shared/decorators/match.decorator';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
	@IsNotEmpty()
	@MinLength(4)
	@MaxLength(16)
	password: string;

	@IsNotEmpty()
	@Match('password')
	confirmPassword: string;
}
