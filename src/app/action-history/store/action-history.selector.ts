import { createSelector } from '@ngrx/store';
import { ITransactionState } from './action-history.reducer';
import { ACTION_HISTORY_FEATURE } from '../constants';

export class ActionHistorySelector {
	static list = createSelector(
		(app: Record<string, any>) => app[ACTION_HISTORY_FEATURE],
		(state: ITransactionState) => state.list,
	);
}
