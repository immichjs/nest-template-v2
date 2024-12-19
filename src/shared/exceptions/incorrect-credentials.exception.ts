import { HttpException, HttpStatus } from '@nestjs/common';

export class IncorrectCredentialsException extends HttpException {
	constructor() {
		super('Incorrect credentials', HttpStatus.UNAUTHORIZED);
	}
}
