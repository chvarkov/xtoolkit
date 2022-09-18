import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActionHistoryAction } from './action-history.action';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActionStatus, DATA_PROVIDER, DataProvider } from '../../core/data-provider/data-provider';
import { ProjectAction } from '../../project/store/project.action';

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

	logCreateProject$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.createProjectSuccess),
		map(({project}) => ActionHistoryAction.logAction({
			data: {
				title: `Created project ${project.name}`,
				data: { name: project.name, chainId: project.chainId },
				status: ActionStatus.Success,
				timestamp: Date.now(),
			},
		})),
	));

	logUploadAbi$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.addAbiSuccess),
		map(({project}) => ActionHistoryAction.logAction({
			data: {
				title: `Added smart contract ${project.smartContracts[project.smartContracts.length - 1].name}`,
				data: {},
				status: ActionStatus.Success,
				timestamp: Date.now(),
			},
		})),
	));

	constructor(private readonly actions$: Actions,
				private readonly store: Store,
				@Inject(DATA_PROVIDER) private readonly dataProvider: DataProvider) {
	}
}
