import { UsersRepositoryContract } from '@domain/contracts/users.repository.contract';
import { CreateUserDto } from '@domain/dtos/create-user.dto';
import { User } from '@domain/entities/user';
import { Inject, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
	@Inject(UsersRepositoryContract)
	private readonly usersRepository: UsersRepositoryContract;

	public async create(data: CreateUserDto): Promise<User> {
		Object.assign(data, { password: await this.hashPassword(data.password) });
		return this.usersRepository.create(data);
	}

	public async findOne(
		filters: Partial<Omit<User, 'password'>>,
	): Promise<User> {
		const user = await this.usersRepository.findOne(filters);
		return user;
	}

	public async update(id: string, data: Partial<User>): Promise<User> {
		if (data.password) {
			Object.assign(data, { password: await this.hashPassword(data.password) });
		}
		return this.usersRepository.update(id, data);
	}

	private async hashPassword(password: string): Promise<string> {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		return hashedPassword;
	}
}
