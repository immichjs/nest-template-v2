import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictUserException extends HttpException {
	constructor() {
		super('User already exists', HttpStatus.CONFLICT);
	}
}
