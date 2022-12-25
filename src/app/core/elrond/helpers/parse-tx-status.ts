import { ITransactionOnNetwork } from '@elrondnetwork/erdjs/out';
import { TransactionStatus } from '../enums/transaction-status';

export function parseTxStatus(tx: ITransactionOnNetwork): TransactionStatus {
	const statusObj = tx.status as unknown as {status: TransactionStatus};

	if (statusObj.status === TransactionStatus.Fail) {
		return TransactionStatus.Fail;
	}

	const errorSignal = tx.logs.findEvents('errorSignal');

	return errorSignal ? TransactionStatus.Fail : TransactionStatus.Success;
}
