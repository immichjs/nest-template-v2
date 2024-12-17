import { RevokedTokenRepositoryContract } from '@domain/contracts/revoked-tokens.repository.contract';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RevokedTokensService {
	@Inject(RevokedTokenRepositoryContract)
	private readonly revokedTokensRepository: RevokedTokenRepositoryContract;

	public async revokeToken(token: string): Promise<void> {
		await this.revokedTokensRepository.revokeToken(token);
	}

	public async isTokenRevoked(token: string): Promise<boolean> {
		return this.revokedTokensRepository.isTokenRevoked(token);
	}
}
