import { createAction, props } from '@ngrx/store';
import { ActionHistoryElement } from '../../core/data-provider/data-provider';

export class ActionHistoryAction {
	static readonly loadActionHistory = createAction(`[${ActionHistoryAction.name}] load action history [...]`);
	static readonly loadActionHistorySuccess = createAction(`[${ActionHistoryAction.name}] load action history  [OK]`, props<{list: ActionHistoryElement[]}>());
	static readonly loadActionHistoryError = createAction(`[${ActionHistoryAction.name}] load action history  [ERR]`, props<{err: Error}>());

	static readonly logAction = createAction(`[${ActionHistoryAction.name}] log action [...]`, props<{data: ActionHistoryElement}>());
	static readonly logActionSuccess = createAction(`[${ActionHistoryAction.name}] log action  [OK]`, props<{list: ActionHistoryElement[]}>());
	static readonly logActionError = createAction(`[${ActionHistoryAction.name}] log action  [ERR]`, props<{err: Error}>());

}

