import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtGuard } from '@shared/guards/jwt.guard';
import { User } from '@shared/decorators/user.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
	@Inject() private readonly usersService: UsersService;

	@UseGuards(JwtGuard)
	@Get('profile')
	public async profile(@User('id') id: string) {
		return this.usersService.findOne({ id });
	}
}
