import { createAction, props } from '@ngrx/store';
import { IElrondTransaction } from '../interfaces/elrond-transaction';

export class TransactionAction {
	static readonly loadTransactions = createAction(`[${TransactionAction.name}] load transactions [...]`, props<{address: string}>());
	static readonly loadTransactionsSuccess = createAction(`[${TransactionAction.name}] load transactions [OK]`, props<{address: string, list: IElrondTransaction[]}>());
	static readonly loadTransactionsError = createAction(`[${TransactionAction.name}] load transactions [ERR]`, props<{err: Error}>());
}

