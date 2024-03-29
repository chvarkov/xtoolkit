import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NewsAction } from './news.action';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiClient } from '../../core/data-provider/api.client';

@Injectable()
export class NewsEffect {
	loadNews$ = createEffect(() => this.actions$.pipe(
		ofType(NewsAction.loadNews),
		switchMap(() => this.apiClient.getNews().pipe(
			map((list) => NewsAction.loadNewsSuccess({list})),
			catchError(err => of(NewsAction.loadNewsError({err})),
		)),
	)));

	loadReleases$ = createEffect(() => this.actions$.pipe(
		ofType(NewsAction.loadReleases),
		switchMap(() => this.apiClient.getReleases().pipe(
			map((list) => NewsAction.loadReleasesSuccess({list})),
			catchError(err => of(NewsAction.loadReleasesError({err})),
			)),
		)));

	constructor(private readonly actions$: Actions,
				private readonly apiClient: ApiClient) {
	}
}
