import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActionHistoryAction } from './action-history.action';
import { catchError, exhaustMap, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { DATA_PROVIDER, DataProvider } from '../../core/data-provider/data-provider';
import { ConfirmDialogComponent } from '../../core/ui/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class ActionHistoryEffect {
	loadActionHistory$ = createEffect(() => this.actions$.pipe(
		ofType(ActionHistoryAction.loadActionHistory),
		switchMap(({projectId}) => this.dataProvider.getActionHistory(projectId).pipe(
			map((list) => ActionHistoryAction.loadActionHistorySuccess({list})),
			catchError(err => of(ActionHistoryAction.loadActionHistoryError({err})),
		)),
	)));

	logAction$ = createEffect(() => this.actions$.pipe(
		ofType(ActionHistoryAction.logAction),
		switchMap(({data}) => this.dataProvider.logAction(data).pipe(
			map((list) => ActionHistoryAction.logActionSuccess({list})),
			catchError(err => of(ActionHistoryAction.logActionError({err})),
			)),
		)));

	updateActionStatus$ = createEffect(() => this.actions$.pipe(
		ofType(ActionHistoryAction.updateActionStatus),
		switchMap(({projectId, id, status}) => this.dataProvider.updateActionStatus(projectId, id, status).pipe(
			map((list) => ActionHistoryAction.updateActionStatusSuccess({list})),
			catchError(err => of(ActionHistoryAction.updateActionStatusError({err})),
			)),
		)));

	clearActionHistory$ = createEffect(() => this.actions$.pipe(
		ofType(ActionHistoryAction.clearActionHistory),
		exhaustMap(action => {
			return this.dialog.open(ConfirmDialogComponent, {
				data: {
					title: 'Clear history',
					message: 'Are you sure? After deletion, it will not be possible to restore.',
				},
			}).afterClosed().pipe(
				filter(v => !!v),
				map(() => action),
			);
		}),
		mergeMap(({projectId}) => this.dataProvider.clearActionHistory(projectId).pipe(
			map((list) => ActionHistoryAction.clearActionHistorySuccess()),
			catchError(err => of(ActionHistoryAction.clearActionHistoryError({err})),
			)),
		)));

	constructor(private readonly actions$: Actions,
				private readonly store: Store,
				private readonly dialog: MatDialog,
				@Inject(DATA_PROVIDER) private readonly dataProvider: DataProvider) {
	}
}
