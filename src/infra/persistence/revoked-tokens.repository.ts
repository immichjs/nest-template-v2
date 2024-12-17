import { RevokedTokenRepositoryContract } from '@domain/contracts/revoked-tokens.repository.contract';
import { RevokedToken } from '@domain/entities/revoked-token';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class RevokedTokensRepository extends RevokedTokenRepositoryContract {
	@InjectRepository(RevokedToken)
	private readonly revokedTokensRepository: Repository<RevokedToken>;

	public async revokeToken(token: string): Promise<void> {
		const revokedToken = await this.revokedTokensRepository.create({ token });
		await this.revokedTokensRepository.save(revokedToken);
	}

	public async isTokenRevoked(token: string): Promise<boolean> {
		const revokedToken = await this.revokedTokensRepository.findOne({
			where: { token },
		});
		const revokedTokenToBoolean = !!revokedToken;
		return revokedTokenToBoolean;
	}
}
