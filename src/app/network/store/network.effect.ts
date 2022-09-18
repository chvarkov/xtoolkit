import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NetworkAction } from './network.action';
import { DATA_PROVIDER, DataProvider } from '../../core/data-provider/data-provider';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class NetworkEffect {
	loadNetworks$ = createEffect(() => this.actions$.pipe(
		ofType(NetworkAction.loadNetworks),
		switchMap(() => this.dataProvider.getNetworks().pipe(
			map((list) => NetworkAction.loadNetworksSuccess({list})),
			catchError(err => of(NetworkAction.loadNetworksError({err})),
		)),
	)));

	constructor(private readonly actions$: Actions,
				@Inject(DATA_PROVIDER) private readonly dataProvider: DataProvider) {
	}
}
