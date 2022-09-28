import { createAction, props } from '@ngrx/store';
import { ActionHistoryElement, ActionStatus } from '../../core/data-provider/data-provider';

export class ActionHistoryAction {
	static readonly loadActionHistory = createAction(`[${ActionHistoryAction.name}] load action history [...]`);
	static readonly loadActionHistorySuccess = createAction(`[${ActionHistoryAction.name}] load action history [OK]`, props<{list: ActionHistoryElement[]}>());
	static readonly loadActionHistoryError = createAction(`[${ActionHistoryAction.name}] load action history [ERR]`, props<{err: Error}>());

	static readonly logAction = createAction(`[${ActionHistoryAction.name}] log action [...]`, props<{data: ActionHistoryElement}>());
	static readonly logActionSuccess = createAction(`[${ActionHistoryAction.name}] log action [OK]`, props<{list: ActionHistoryElement[]}>());
	static readonly logActionError = createAction(`[${ActionHistoryAction.name}] log action [ERR]`, props<{err: Error}>());

	static readonly updateActionStatus = createAction(`[${ActionHistoryAction.name}] update action status [...]`, props<{id: string, status: ActionStatus}>());
	static readonly updateActionStatusSuccess = createAction(`[${ActionHistoryAction.name}] update action status [OK]`, props<{list: ActionHistoryElement[]}>());
	static readonly updateActionStatusError = createAction(`[${ActionHistoryAction.name}] update action status [ERR]`, props<{err: Error}>());

	static readonly clearActionHistory = createAction(`[${ActionHistoryAction.name}] clear action history [...]`);
	static readonly clearActionHistorySuccess = createAction(`[${ActionHistoryAction.name}] clear action history [OK]`);
	static readonly clearActionHistoryError = createAction(`[${ActionHistoryAction.name}] clear action history [ERR]`, props<{err: Error}>());
}

