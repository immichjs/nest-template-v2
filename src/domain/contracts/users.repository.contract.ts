import { User } from '@domain/entities/user';

export abstract class UsersRepositoryContract {
	abstract create(data: any): Promise<User>;
	abstract find(filters: Partial<User>): Promise<User[]>;
	abstract findOne(filters: Partial<User>): Promise<User>;
	abstract update(id: string, data: any): Promise<User>;
	abstract delete(id: string): Promise<void>;
}
