import { UsersRepositoryContract } from '@domain/contracts/users.repository.contract';
import { CreateUserDto } from '@domain/dtos/create-user.dto';
import { UpdateUserDto } from '@domain/dtos/update-user.dto';
import { User } from '@domain/entities/user';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictUserException } from '@shared/exceptions/conflict-user.exceptions';
import { UserNotFoundException } from '@shared/exceptions/user-not-found.exception';
import { Not, Repository } from 'typeorm';

export class UsersRepository extends UsersRepositoryContract {
	@InjectRepository(User) private readonly usersRepository: Repository<User>;

	public async create(data: CreateUserDto): Promise<User> {
		const user = this.usersRepository.create(data);

		return this.usersRepository.save(user);
	}

	public async find(filters: Partial<User>): Promise<User[]> {
		const users = await this.usersRepository.find({
			where: filters,
		});

		return users;
	}

	public async findOne(filters: Partial<User>): Promise<User> {
		const user = await this.usersRepository.findOne({
			where: filters,
		});

		return user;
	}

	public async update(id: string, data: UpdateUserDto): Promise<User> {
		const user = await this.usersRepository.findOne({
			where: {
				id,
			},
		});

		if (!user) {
			throw new UserNotFoundException();
		}

		if (data.email) {
			const emailAlreadyInUse = await this.usersRepository.findOne({
				where: {
					id: Not(id),
					email: data.email,
				},
			});

			if (emailAlreadyInUse) {
				throw new ConflictUserException();
			}
		}

		Object.assign(user, data);
		return this.usersRepository.save(user);
	}

	public async delete(id: string): Promise<void> {
		const user = await this.findOne({ id });

		if (!user) {
			throw new UserNotFoundException();
		}

		await this.usersRepository.delete(id);
	}
}
