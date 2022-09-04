import { Action, createReducer, on } from '@ngrx/store';
import { TransactionAction } from './transaction.action';
import { IElrondTransaction } from '../interfaces/elrond-transaction';

export interface ITransactionState {
	transactionMap: {[address: string]: IElrondTransaction[]};
}

const initialState: ITransactionState = {
	transactionMap: {},
};

export const reducer = createReducer(
	initialState,
	on(TransactionAction.loadTransactionsSuccess, (state, { address, list }) => ({
		...state,
		transactionMap: {
			[address]: [...state.transactionMap[address] || [], ...list],
		},
	})),
);


export function transactionReducer(state: ITransactionState | undefined, action: Action): ITransactionState {
	return reducer(state, action);
}
