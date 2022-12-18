import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NetworkAction } from './network.action';
import { DATA_PROVIDER, DataProvider } from '../../core/data-provider/data-provider';
import { catchError, exhaustMap, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConfirmDialogComponent } from '../../core/ui/confirm-dialog/confirm-dialog.component';
import { NetworkEditorDialogComponent } from '../components/network-editor-dialog/network-editor-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class NetworkEffect {
	loadNetworks$ = createEffect(() => this.actions$.pipe(
		ofType(NetworkAction.loadNetworks),
		switchMap(() => this.dataProvider.getNetworks().pipe(
			map((list) => NetworkAction.loadNetworksSuccess({list})),
			catchError(err => of(NetworkAction.loadNetworksError({err})),
		)),
	)));

	addNetwork$ = createEffect(() => this.actions$.pipe(
		ofType(NetworkAction.addNetwork),
		exhaustMap(() => this.dialog.open(NetworkEditorDialogComponent).afterClosed()),
		filter(v => !!v),
		mergeMap(({network}) => this.dataProvider.addNetwork(network).pipe(
			map((list) => NetworkAction.addNetworkSuccess({list})),
			catchError(err => of(NetworkAction.addNetworkError({err})),
		))),
	));

	updateNetwork$ = createEffect(() => this.actions$.pipe(
		ofType(NetworkAction.updateNetwork),
		exhaustMap((action) => {
			return this.dialog.open(NetworkEditorDialogComponent, {data: action.network}).afterClosed();
		}),
		filter(v => !!v),
		mergeMap(({chainId, network}) => this.dataProvider.updateNetwork(chainId, network).pipe(
			map((list) => NetworkAction.updateNetworkSuccess({list})),
			catchError(err => of(NetworkAction.updateNetworkError({err})),
		))),
	));

	deleteNetwork$ = createEffect(() => this.actions$.pipe(
		ofType(NetworkAction.deleteNetwork),
		exhaustMap(action => {
			return this.dialog.open(ConfirmDialogComponent, {
				data: {
					title: 'Delete network',
					message: 'Are you sure? After deletion, it will not be possible to restore.',
				},
			}).afterClosed().pipe(
				filter(v => !!v),
				map(() => action),
			);
		}),
		mergeMap(({chainId}) => this.dataProvider.deleteNetwork(chainId).pipe(
			map((list) => NetworkAction.deleteNetworkSuccess({list})),
			catchError(err => of(NetworkAction.deleteNetworkError({err})),
		))),
	));

	constructor(private readonly actions$: Actions,
				private readonly dialog: MatDialog,
				@Inject(DATA_PROVIDER) private readonly dataProvider: DataProvider) {
	}
}
