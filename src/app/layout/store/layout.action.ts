import { createAction, props } from '@ngrx/store';
import { LayoutState } from '../../core/data-provider/personal-settings.manager';

export class LayoutAction {
	static readonly toggleLoadingScreen = createAction(`[${LayoutAction.name}] toggle loading screen`, props<{visible: boolean}>());

	static readonly loadLayoutState = createAction(`[${LayoutAction.name}] load layout state [...]`);
	static readonly loadLayoutStateSuccess = createAction(`[${LayoutAction.name}] load layout state [OK]`, props<LayoutState>());
	static readonly loadLayoutStateError = createAction(`[${LayoutAction.name}] load layout state [ERR]`, props<{err: Error}>());

	static readonly setLayoutState = createAction(`[${LayoutAction.name}] set layout state [...]`, props<{layoutState: Partial<LayoutState>}>());
	static readonly setLayoutStateSuccess = createAction(`[${LayoutAction.name}] set layout state [OK]`, props<{ layoutState: LayoutState }>());
	static readonly setLayoutStateError = createAction(`[${LayoutAction.name}] set layout state [ERR]`, props<{err: Error}>());
}
