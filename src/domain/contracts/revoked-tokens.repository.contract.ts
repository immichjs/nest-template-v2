export abstract class RevokedTokenRepositoryContract {
	abstract revokeToken(token: string): Promise<void>;
	abstract isTokenRevoked(token: string): Promise<boolean>;
}
