import { TransactionStatus } from '../enums/transaction-status';

export interface ITransactionPreview {
	hash: string;
	calledSc: string;
	function: string;
	initiator: string;
	assetName: string;
	assetIcon: string;
	amount: string;
	status: TransactionStatus;
}
