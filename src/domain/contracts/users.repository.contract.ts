import { User } from '@domain/entities/user';

export abstract class UsersRepositoryContract {
	abstract create(data: any): Promise<User>;
	abstract get(filters: Partial<User>): Promise<User>;
	abstract findOne(filters: Partial<Omit<User, 'password'>>): Promise<User>;
	abstract find(filters: Partial<Omit<User, 'password'>>): Promise<User>;
	abstract update(id: string, data: any): Promise<User>;
	abstract delete(id: string): Promise<User>;
}
