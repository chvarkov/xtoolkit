import { Action, createReducer, on } from '@ngrx/store';
import { ActionHistoryAction } from './action-history.action';
import { IElrondTransaction } from '../../core/elrond/interfaces/elrond-transaction';

export interface ITransactionState {
	transactionMap: {[address: string]: IElrondTransaction[]};
}

const initialState: ITransactionState = {
	transactionMap: {},
};

export const reducer = createReducer(
	initialState,
	on(ActionHistoryAction.loadTransactionsSuccess, (state, { address, list }) => ({
		...state,
		transactionMap: {
			[address]: [...state.transactionMap[address] || [], ...list],
		},
	})),
);


export function actionHistoryReducer(state: ITransactionState | undefined, action: Action): ITransactionState {
	return reducer(state, action);
}
