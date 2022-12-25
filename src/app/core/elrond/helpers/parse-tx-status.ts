import { ITransactionOnNetwork } from '@elrondnetwork/erdjs/out';
import { TransactionStatus } from '../enums/transaction-status';

export function parseTxStatus(tx: ITransactionOnNetwork): TransactionStatus {
	if (tx.status.isPending()) {
		return TransactionStatus.Pending;
	}

	if (tx.status.isFailed() || tx.status.isInvalid()) {
		return TransactionStatus.Fail;
	}

	const errorSignals = tx.logs.findEvents('signalError');

	if (errorSignals.length) {
		return TransactionStatus.Fail;
	}

	return TransactionStatus.Success
}
