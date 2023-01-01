import { createSelector } from '@ngrx/store';
import { ISecurityState } from './security.reducer';
import { SECURITY_FEATURE } from '../constants';

export class SecuritySelector {
	static passwordHash = createSelector(
		(app: Record<string, any>) => app[SECURITY_FEATURE],
		(state: ISecurityState) => state.passwordHash,
	);

	static isPasswordSet = createSelector(
		(app: Record<string, any>) => app[SECURITY_FEATURE],
		(state: ISecurityState) => state.isPasswordSet,
	);

	static isSecretsUnlocked = createSelector(
		(app: Record<string, any>) => app[SECURITY_FEATURE],
		(state: ISecurityState) => !!state.passwordHash,
	);
}
