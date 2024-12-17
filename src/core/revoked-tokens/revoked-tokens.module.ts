import { RevokedTokenRepositoryContract } from '@domain/contracts/revoked-tokens.repository.contract';
import { RevokedToken } from '@domain/entities/revoked-token';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RevokedTokensRepository } from './../../infra/persistence/revoked-tokens.repository';
import { RevokedTokensService } from './revoked-tokens.service';

@Module({
	imports: [TypeOrmModule.forFeature([RevokedToken])],
	providers: [
		{
			provide: RevokedTokenRepositoryContract,
			useClass: RevokedTokensRepository,
		},
		RevokedTokensService,
	],
	exports: [RevokedTokensService],
})
export class RevokedTokensModule {}
