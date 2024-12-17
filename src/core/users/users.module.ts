import { UsersRepositoryContract } from '@domain/contracts/users.repository.contract';
import { User } from '@domain/entities/user';
import { UsersRepository } from '@infra/persistence/users.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [UsersController],
	providers: [
		{
			provide: UsersRepositoryContract,
			useClass: UsersRepository,
		},
		UsersService,
	],
	exports: [UsersService],
})
export class UsersModule {}
