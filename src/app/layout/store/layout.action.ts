import { createAction, props } from '@ngrx/store';

export class LayoutAction {
	static readonly toggleLoadingScreen = createAction(`[${LayoutAction.name}] toggle loading screen`, props<{visible: boolean}>());
}

