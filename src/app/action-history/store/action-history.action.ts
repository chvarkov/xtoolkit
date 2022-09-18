import { createAction, props } from '@ngrx/store';
import { IElrondTransaction } from '../../core/elrond/interfaces/elrond-transaction';

export class ActionHistoryAction {
	static readonly loadTransactions = createAction(`[${ActionHistoryAction.name}] load transactions [...]`, props<{address: string}>());
	static readonly loadTransactionsSuccess = createAction(`[${ActionHistoryAction.name}] load transactions [OK]`, props<{address: string, list: IElrondTransaction[]}>());
	static readonly loadTransactionsError = createAction(`[${ActionHistoryAction.name}] load transactions [ERR]`, props<{err: Error}>());
}

