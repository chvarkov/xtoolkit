import { Observable } from 'rxjs';

export const SECRET_MANAGER = 'CORE:SECRET_MANAGER';

export interface SecretManager {
	isPasswordInitialized(): Observable<boolean>;

	encodePassword(password: string): Observable<string>;

	setPassword(password: string, previousPassword?: string): Observable<string>;

	isValidPassword(password: string): Observable<boolean>;

	isValidPasswordHash(passwordHash: string): Observable<boolean>;

	getWalletSecret(passwordHash: string, projectId: string, address: string): Observable<string>;

	setWalletSecret(passwordHash: string, projectId: string, address: string, secret: string): Observable<void>;

	deleteWalletSecret(passwordHash: string, projectId: string, address: string): Observable<void>;

	deleteWalletSecretsByProjectId(passwordHash: string, projectId: string): Observable<void>;
}
