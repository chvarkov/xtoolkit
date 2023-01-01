import { SecretManager } from '../secret.manager';
import { Injectable } from '@angular/core';
import { from, Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GLOBAL_PREFIX } from './constants';
import * as md5 from 'crypto-js/md5';
import * as aes from 'crypto-js/aes';
import * as encUtf8 from 'crypto-js/enc-utf8';

@Injectable({providedIn: 'root'})
export class LocalstorageSecretManager implements SecretManager {
	private readonly verificationMessage = Math.PI.toFixed(13);
	private readonly salt = 'c3c62ea42d6ad4ac7506b60ff1851f4c';

	private readonly passwordSignatureKey = `${GLOBAL_PREFIX}.password_signature`;

	isPasswordInitialized(): Observable<boolean> {
		return of(!!this.get(this.passwordSignatureKey));
	}

	encodePassword(password: string): Observable<string> {
		const passwordBuffer = new TextEncoder().encode(`${this.salt}:${password}`);

		const hashPromise = crypto.subtle.digest('SHA-256', passwordBuffer)
			.then(array => Buffer.from(array))
			.then(hashBuffer => hashBuffer.toString('hex'));

		return from(hashPromise);
	}

	setPassword(password: string, previousPassword?: string): Observable<string> {
		return of(null).pipe(
			switchMap(() => this.isPasswordInitialized().pipe(
				switchMap(isInitialized => {
					if (!previousPassword && isInitialized) {
						return throwError(new Error('Previous password is not provided.'));
					}

					if (!previousPassword) {
						return of(undefined);
					}

					return this.encodePassword(previousPassword).pipe(
						switchMap(prevPasswordHash => this.assetValidPasswordHash(prevPasswordHash))
					);
				}),
			)),
			switchMap(() => this.encodePassword(password)),
			switchMap((passwordHash) => {
				const verificationMessage = this.encrypt(passwordHash, this.verificationMessage);

				this.set(this.passwordSignatureKey, verificationMessage);

				return of(passwordHash);
			}),
		);
	}

	isValidPassword(password: string): Observable<boolean> {
		return this.encodePassword(password).pipe(
			switchMap((passwordHash) => this.isValidPasswordHash(passwordHash)),
		);
	}

	isValidPasswordHash(passwordHash: string): Observable<boolean> {
		return of(null).pipe(
			switchMap(() => {
				const message = this.get(this.passwordSignatureKey);

				if (!message) {
					return throwError('Password is not using.');
				}

				return of(this.decrypt(passwordHash, message) === this.verificationMessage);
			}),
		);
	}

	getWalletSecret(passwordHash: string, projectId: string, address: string): Observable<string> {
		return this.getWalletSecretMap(passwordHash, projectId).pipe(
			switchMap((map) => {
				const secret = map[address];

				if (!secret) {
					return throwError(new Error(`Wallet secret [${projectId} / ${address}] not found.`));
				}

				return of(secret);
			}),
		);
	}

	setWalletSecret(passwordHash: string, projectId: string, address: string, secret: string): Observable<void> {
		return this.getWalletSecretMap(passwordHash, projectId).pipe(
			switchMap((map) => {
				try {
					map[address] = secret;

					this.setWalletSecretMap(passwordHash, projectId, map);

					return of(undefined);
				} catch (e) {
					return throwError(e);
				}
			}),
		);
	}

	deleteWalletSecret(passwordHash: string, projectId: string, address: string): Observable<void> {
		return this.getWalletSecretMap(passwordHash, projectId).pipe(
			switchMap((map) => {
				try {
					delete map[address];

					this.setWalletSecretMap(passwordHash, projectId, map);

					return of(undefined);
				} catch (e) {
					return throwError(e);
				}
			}),
		);
	}

	deleteWalletSecretsByProjectId(passwordHash: string, projectId: string): Observable<void> {
		return this.assetValidPasswordHash(passwordHash).pipe(
			switchMap(() => {
				try {
					localStorage.removeItem(this.getProjectWalletsKey(projectId));

					return of(undefined);
				} catch (e) {
					return throwError(e);
				}
			}),
		);
	}

	private setWalletSecretMap(passwordHash: string, projectId: string, map: Record<string, string>): Observable<void> {
		return this.assetValidPasswordHash(passwordHash).pipe(
			switchMap(() => {
				try {
					const encryptedJson = this.encryptMap(passwordHash, projectId, map);

					this.set(this.getProjectWalletsKey(projectId), encryptedJson);

					return of(undefined);
				} catch (e) {
					return throwError(e);
				}
			})
		);
	}

	private getWalletSecretMap(passwordHash: string, projectId: string): Observable<Record<string, string>> {
		return this.assetValidPasswordHash(passwordHash).pipe(
			switchMap(() => {
				try {
					const encryptedJson = this.get(this.getProjectWalletsKey(projectId));

					if (!encryptedJson) {
						return of({});
					}

					return of(this.decryptMap(passwordHash, projectId, encryptedJson));
				} catch (e) {
					return throwError(e);
				}
			})
		);
	}

	private assetValidPasswordHash(passwordHash: string): Observable<void> {
		return this.isValidPasswordHash(passwordHash).pipe(
			switchMap(isValid => {
				if (isValid) {
					return throwError(new Error('Password '))
				}

				return of(undefined);
			}),
		);
	}

	private getProjectWalletsKey(projectId: string): string {
		return `${GLOBAL_PREFIX}.wallets.${projectId}`;
	}

	private decryptMap(passwordHash: string, projectId: string, encryptedData: string): Record<string, string> {
		const projectSecret = this.getProjectSecret(passwordHash, projectId);

		const json = this.decrypt(projectSecret, encryptedData);

		return JSON.parse(json);
	}

	private encryptMap(passwordHash: string, projectId: string, map: Record<string, string>): string {
		const projectSecret = this.getProjectSecret(passwordHash, projectId);

		return this.encrypt(projectSecret, JSON.stringify(map));
	}

	private decrypt(passwordHashOrSecret: string, encryptedMessage: string): string {
		return aes.decrypt(encryptedMessage, passwordHashOrSecret).toString(encUtf8);
	}

	private encrypt(passwordHashOrSecret: string, data: string): string {
		return aes.encrypt(data, passwordHashOrSecret).toString();
	}

	private getProjectSecret(passwordHash: string, projectId: string): string {
		return `${passwordHash}:${md5(projectId)}`;
	}

	private set(key: string, value: string): void {
		return localStorage.setItem(key, value);
	}

	private get(key: string): string | null {
		return localStorage.getItem(key) || null;
	}
}
