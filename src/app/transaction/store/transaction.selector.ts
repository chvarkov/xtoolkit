import { createSelector } from '@ngrx/store';
import { ITransactionState } from './transaction.reducer';
import { TRANSACTION_FEATURE } from '../constants';

export class TransactionSelector {
	static transactionsByAddress = (address: string) => createSelector(
		(app: Record<string, any>) => app[TRANSACTION_FEATURE],
		(state: ITransactionState) => state.transactionMap[address],
	);
}
