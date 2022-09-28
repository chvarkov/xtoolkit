import { Action, createReducer, on } from '@ngrx/store';
import { ActionHistoryAction } from './action-history.action';
import { ActionHistoryElement } from '../../core/data-provider/data-provider';

export interface ITransactionState {
	list: ActionHistoryElement[];
}

const initialState: ITransactionState = {
	list: [],
};

export const reducer = createReducer(
	initialState,
	on(ActionHistoryAction.logActionSuccess,
		ActionHistoryAction.loadActionHistorySuccess,
		ActionHistoryAction.updateActionStatusSuccess,
		(state, { list }) => ({
		...state,
		list,
	})),
	on(ActionHistoryAction.clearActionHistory, (state) => ({
		...state,
		list: [],
	})),
);

export function actionHistoryReducer(state: ITransactionState | undefined, action: Action): ITransactionState {
	return reducer(state, action);
}
