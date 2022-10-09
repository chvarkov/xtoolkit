import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PERSONAL_SETTINGS_MANAGER } from '../../core/data-provider/personal-settings.manager';
import { LocalstoragePersonalSettingManager } from '../../core/data-provider/localstorage/localstorage-personal-setting.manager';
import { LayoutAction } from './layout.action';

@Injectable()
export class LayoutEffect {
	loadLayoutState$ = createEffect(() => this.actions$.pipe(
		ofType(LayoutAction.loadLayoutState),
		switchMap(() => this.personalSettingsManger.getLayoutState().pipe(
			map((state) => LayoutAction.loadLayoutStateSuccess(state)),
			catchError(err => of(LayoutAction.loadLayoutStateError({err})),
		)),
	)));

	setLayoutState$ = createEffect(() => this.actions$.pipe(
		ofType(LayoutAction.setLayoutState),
		switchMap(({layoutState}) => this.personalSettingsManger.setLayoutState(layoutState).pipe(
			map((layoutState) => LayoutAction.setLayoutStateSuccess({ layoutState })),
			catchError(err => of(LayoutAction.setLayoutStateError({err})),
			)),
		)));

	toggleTheme$ = createEffect(() => this.actions$.pipe(
		ofType(LayoutAction.toggleTheme),
		switchMap(() => this.personalSettingsManger.toggleTheme().pipe(
			map((layoutState) => LayoutAction.toggleThemeSuccess({ layoutState })),
			catchError(err => of(LayoutAction.toggleThemeError({err})),
			)),
		)));

	constructor(private readonly actions$: Actions,
				@Inject(PERSONAL_SETTINGS_MANAGER) private readonly personalSettingsManger: LocalstoragePersonalSettingManager) {
	}
}
