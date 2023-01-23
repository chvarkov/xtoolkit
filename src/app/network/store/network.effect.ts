import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NetworkAction } from './network.action';
import { DATA_PROVIDER, DataProvider } from '../../core/data-provider/data-provider';
import { catchError, exhaustMap, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConfirmDialogComponent } from '../../core/ui/confirm-dialog/confirm-dialog.component';
import { NetworkEditorDialogComponent } from '../components/network-editor-dialog/network-editor-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ElrondDataProvider } from '../../core/elrond/elrond.data-provider';
import { NetworkFactory } from '../helpers/network.factory';
import { ToastrService } from 'ngx-toastr';

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
		exhaustMap(() => this.dialog.open(NetworkEditorDialogComponent, {width: '510px'}).afterClosed()),
		filter(v => !!v),
		mergeMap((network) => this.dataProvider.addNetwork(network).pipe(
			map((list) => NetworkAction.addNetworkSuccess({list})),
			catchError(err => of(NetworkAction.addNetworkError({err})),
		))),
	));

	addNetworkSuccess$ = createEffect(() => this.actions$.pipe(
		ofType(NetworkAction.addNetworkSuccess),
		tap(() => this.toastrService.success('Network successful added', 'Add network')),
	), {dispatch: false});

	addNetworkError$ = createEffect(() => this.actions$.pipe(
		ofType(NetworkAction.addNetworkError),
		tap(() => this.toastrService.error('Something went wrong, please refresh the page and try again', 'Cannot add network')),
	), {dispatch: false});

	updateNetwork$ = createEffect(() => this.actions$.pipe(
		ofType(NetworkAction.updateNetwork),
		exhaustMap((action) => {
			return this.dialog.open(NetworkEditorDialogComponent, {data: action.network, width: '510px'}).afterClosed().pipe(
				filter(v => !!v),
				map((network) => ({network, chainId: action.network.chainId})),
			);
		}),
		mergeMap(({chainId, network}) => this.dataProvider.updateNetwork(chainId, network).pipe(
			map((list) => NetworkAction.updateNetworkSuccess({list})),
			catchError(err => of(NetworkAction.updateNetworkError({err})),
		))),
	));

	updateNetworkSuccess$ = createEffect(() => this.actions$.pipe(
		ofType(NetworkAction.updateNetworkSuccess),
		tap(() => this.toastrService.success('Network successful updated', 'Update network')),
	), {dispatch: false});

	updateNetworkError$ = createEffect(() => this.actions$.pipe(
		ofType(NetworkAction.updateNetworkError),
		tap(() => this.toastrService.error('Something went wrong, please refresh the page and try again', 'Cannot update network')),
	), {dispatch: false});

	syncNetwork$ = createEffect(() => this.actions$.pipe(
		ofType(NetworkAction.syncNetwork),
		mergeMap(({network}) => this.elrondDataProvider.getDappConfig(network.apiUrl).pipe(
			map((dappConfig) =>  {
				const updatedNetwork = NetworkFactory.createFromDappConfig(dappConfig);

				return { chainId: network.chainId, network: updatedNetwork };
			}),
			mergeMap(({chainId, network}) => this.dataProvider.updateNetwork(chainId, network).pipe(
				map((list) => NetworkAction.syncNetworkSuccess({list})),
				catchError(err => of(NetworkAction.syncNetworkError({err}))),
			)),
			catchError(err => of(NetworkAction.syncNetworkError({err})),
		))),
	));

	syncNetworkSuccess$ = createEffect(() => this.actions$.pipe(
		ofType(NetworkAction.syncNetworkSuccess),
		tap(() => this.toastrService.success('Network successful synchronized', 'Sync network')),
	), {dispatch: false});

	syncNetworkError$ = createEffect(() => this.actions$.pipe(
		ofType(NetworkAction.syncNetworkError),
		tap(() => this.toastrService.error('Something went wrong, please refresh the page and try again', 'Cannot sync network')),
	), {dispatch: false});

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

	deleteNetworkSuccess$ = createEffect(() => this.actions$.pipe(
		ofType(NetworkAction.deleteNetworkSuccess),
		tap(() => this.toastrService.success('Network successful deleted', 'Delete network')),
	), {dispatch: false});

	deleteNetworkError$ = createEffect(() => this.actions$.pipe(
		ofType(NetworkAction.deleteNetworkError),
		tap(() => this.toastrService.error('Something went wrong, please refresh the page and try again', 'Cannot delete network')),
	), {dispatch: false});

	constructor(private readonly actions$: Actions,
				private readonly dialog: MatDialog,
				private readonly elrondDataProvider: ElrondDataProvider,
				private readonly toastrService: ToastrService,
				@Inject(DATA_PROVIDER) private readonly dataProvider: DataProvider) {
	}
}
