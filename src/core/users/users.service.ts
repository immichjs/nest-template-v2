import { UsersRepositoryContract } from '@domain/contracts/users.repository.contract';
import { CreateUserDTO } from '@domain/dtos/users/create-user.dto';
import { User } from '@domain/entities/user';
import { Inject, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
	@Inject(UsersRepositoryContract)
	private readonly usersRepository: UsersRepositoryContract;

	public async create(data: CreateUserDTO): Promise<User> {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(data.password, salt);
		return this.usersRepository.create({ ...data, password: hashedPassword });
	}

	public async findOne(
		filters: Partial<Omit<User, 'password'>>,
	): Promise<User> {
		const user = await this.usersRepository.findOne(filters);
		return user;
	}
}
