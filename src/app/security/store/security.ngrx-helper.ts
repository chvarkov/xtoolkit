import { Observable, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { SecuritySelector } from './security.selector';
import { PutPasswordComponent } from '../components/put-password/put-password.component';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { SecretManager } from '../../core/data-provider/secret.manager';
import { SecurityAction } from './security.action';

export class SecurityNgrxHelper {
	static resolvePasswordHash<T = any>(store: Store,
										dialog: MatDialog,
										secretManager: SecretManager): Observable<string> {
		return of(undefined).pipe(
			switchMap(() => store.select(SecuritySelector.passwordHash).pipe(
				switchMap((passwordHash) => {
					return passwordHash
						? of(passwordHash)
						: dialog.open(PutPasswordComponent).afterClosed().pipe(
							filter(password => !!password),
							switchMap(password => secretManager.encodePassword(password)),
							tap((encodedPassword) => store.dispatch(SecurityAction.putPasswordSuccess({encodedPassword}))),
						);
				}),
			)),
			filter(passwordHash => !!passwordHash),
		);
	}
}
