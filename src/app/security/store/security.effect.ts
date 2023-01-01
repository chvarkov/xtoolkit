import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SecurityAction } from './security.action';
import { DATA_PROVIDER, DataProvider } from '../../core/data-provider/data-provider';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SecurityService } from '../services/security.service';
import { PutPasswordComponent } from '../components/put-password/put-password.component';
import { SECRET_MANAGER } from '../../core/data-provider/secret.manager';
import { LocalstorageSecretManager } from '../../core/data-provider/localstorage/localstorage-secret.manager';

@Injectable()
export class SecurityEffect {
	loadSecurityState$ = createEffect(() => this.actions$.pipe(
		ofType(SecurityAction.loadSecurityState),
		switchMap(() => this.secretManager.isPasswordInitialized().pipe(
			map((isPasswordSet) => SecurityAction.loadSecurityStateSuccess({isPasswordSet})),
			catchError(err => of(SecurityAction.loadSecurityStateError({err})),
		)),
	)));

	setPassword$ = createEffect(() => this.actions$.pipe(
		ofType(SecurityAction.setPassword),
		switchMap(({ password, currentPassword }) => this.secretManager.setPassword(password, currentPassword).pipe(
			map((encodedPassword) => SecurityAction.setPasswordSuccess({encodedPassword})),
			catchError(err => of(SecurityAction.setPasswordError({err})),
			)),
		)));

	putPassword$ = createEffect(() => this.actions$.pipe(
		ofType(SecurityAction.putPassword),
		switchMap(() => this.dialog.open(PutPasswordComponent).afterClosed().pipe(
			filter(v => !!v),
		)),
		switchMap((password) => this.secretManager.encodePassword(password).pipe(
			map((encodedPassword) => SecurityAction.putPasswordSuccess({encodedPassword})),
			catchError(err => of(SecurityAction.putPasswordError({err})),
		)),
	)));

	constructor(private readonly actions$: Actions,
				private readonly dialog: MatDialog,
				private readonly security: SecurityService,
				@Inject(SECRET_MANAGER) private readonly secretManager: LocalstorageSecretManager,
				@Inject(DATA_PROVIDER) private readonly dataProvider: DataProvider) {
	}
}
