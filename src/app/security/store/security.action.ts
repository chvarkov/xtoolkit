import { createAction, props } from '@ngrx/store';

export class SecurityAction {
	static readonly loadSecurityState = createAction(`[${SecurityAction.name}] load security state [...]`);
	static readonly loadSecurityStateSuccess = createAction(`[${SecurityAction.name}] load security state [OK]`, props<{isPasswordSet: boolean}>());
	static readonly loadSecurityStateError = createAction(`[${SecurityAction.name}] load security state [ERR]`, props<{err: Error}>());

	static readonly putPassword = createAction(`[${SecurityAction.name}] put password [...]`);
	static readonly putPasswordSuccess = createAction(`[${SecurityAction.name}] put password [OK]`, props<{encodedPassword: string}>());
	static readonly putPasswordError = createAction(`[${SecurityAction.name}] put password [ERR]`, props<{err: Error}>());

	static readonly setPassword = createAction(`[${SecurityAction.name}] set password [...]`, props<{password: string, currentPassword?: string}>());
	static readonly setPasswordSuccess = createAction(`[${SecurityAction.name}] set password [OK]`, props<{encodedPassword: string}>());
	static readonly setPasswordError = createAction(`[${SecurityAction.name}] set password [ERR]`, props<{err: Error}>());

	static readonly clearPasswordHash = createAction(`[${SecurityAction.name}] clear password hash`);
}
