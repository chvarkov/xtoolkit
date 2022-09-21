import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActionHistoryAction } from './action-history.action';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { DATA_PROVIDER, DataProvider } from '../../core/data-provider/data-provider';

@Injectable()
export class ActionHistoryEffect {
	loadActionHistory$ = createEffect(() => this.actions$.pipe(
		ofType(ActionHistoryAction.loadActionHistory),
		switchMap(() => this.dataProvider.getActionHistory().pipe(
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
		switchMap(({id, status}) => this.dataProvider.updateActionStatus(id, status).pipe(
			map((list) => ActionHistoryAction.updateActionStatusSuccess({list})),
			catchError(err => of(ActionHistoryAction.updateActionStatusError({err})),
			)),
		)));

	constructor(private readonly actions$: Actions,
				private readonly store: Store,
				@Inject(DATA_PROVIDER) private readonly dataProvider: DataProvider) {
	}
}
