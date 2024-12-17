import { UsersRepositoryContract } from '@domain/contracts/users.repository.contract';
import { CreateUserDTO } from '@domain/dtos/users/create-user.dto';
import { User } from '@domain/entities/user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class UsersRepository extends UsersRepositoryContract {
	@InjectRepository(User) private readonly usersRepository: Repository<User>;

	public async create(data: CreateUserDTO): Promise<User> {
		const user = this.usersRepository.create(data);
		return this.usersRepository.save(user);
	}

	public async get(filters: Partial<User>): Promise<User> {
		throw new Error('Method not implemented.');
	}

	public async findOne(
		filters: Partial<Omit<User, 'password'>>,
	): Promise<User> {
		const user = await this.usersRepository.findOne({
			where: {
				...filters,
			},
		});

		return user;
	}

	public async find(filters: Partial<Omit<User, 'password'>>): Promise<User> {
		throw new Error('Method not implemented.');
	}

	public async update(id: string, data: any): Promise<User> {
		throw new Error('Method not implemented.');
	}

	public async delete(id: string): Promise<User> {
		throw new Error('Method not implemented.');
	}
}
