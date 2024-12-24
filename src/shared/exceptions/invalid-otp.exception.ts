import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidOTPException extends HttpException {
	constructor() {
		super('Invalid OTP', HttpStatus.UNAUTHORIZED);
	}
}
