import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NetworkAction } from './network.action';
import { DATA_PROVIDER, DataProvider } from '../../core/data-provider/data-provider';
import { catchError, exhaustMap, map, mergeMap, switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { ProjectAction } from '../../project/store/project.action';
import { ConfirmDialogComponent } from '../../core/ui/confirm-dialog/confirm-dialog.component';
import { ModalDialogFactory } from '../../core/ui/dialog/modal-dialog.factory';
import { NetworkEditorDialogComponent } from '../components/network-editor-dialog/network-editor-dialog.component';

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
		exhaustMap(() => this.modalDialogFactory.show(NetworkEditorDialogComponent).afterSubmit$()),
		mergeMap(({network}) => this.dataProvider.addNetwork(network).pipe(
			map((list) => NetworkAction.addNetworkSuccess({list})),
			catchError(err => of(NetworkAction.addNetworkError({err})),
		))),
	));

	updateNetwork$ = createEffect(() => this.actions$.pipe(
		ofType(NetworkAction.updateNetwork),
		exhaustMap((action) => {
			return this.modalDialogFactory.show(NetworkEditorDialogComponent, action.network).afterSubmit$();
		}),
		mergeMap(({chainId, network}) => this.dataProvider.updateNetwork(chainId, network).pipe(
			map((list) => NetworkAction.updateNetworkSuccess({list})),
			catchError(err => of(NetworkAction.updateNetworkError({err})),
		))),
	));

	deleteNetwork$ = createEffect(() => this.actions$.pipe(
		ofType(NetworkAction.deleteNetwork),
		exhaustMap(action => {
			return this.modalDialogFactory.show(ConfirmDialogComponent, {
				title: 'Delete network',
				message: 'Are you sure? After deletion, it will not be possible to restore.',
			}).afterSubmit$().pipe(
				map(() => action),
			);
		}),
		mergeMap(({chainId}) => this.dataProvider.deleteNetwork(chainId).pipe(
			map((list) => NetworkAction.deleteNetworkSuccess({list})),
			catchError(err => of(NetworkAction.deleteNetworkError({err})),
		))),
	));

	constructor(private readonly actions$: Actions,
				private readonly modalDialogFactory: ModalDialogFactory,
				@Inject(DATA_PROVIDER) private readonly dataProvider: DataProvider) {
	}
}
