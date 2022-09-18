import { TransactionStatus } from '../enums/transaction-status';

export interface ITokenTransferArgPayload {
	decimals: number;
	name: string;
	svgUrl: string;
	ticker: string;
	token: string;
	type: string;
	value: string;
}

export interface ITokenTransferArgs {
	receiver: string;
	transfers: ITokenTransferArgPayload[];
}

export interface ITokenTransferAction {
	arguments: ITokenTransferArgs;
	decimals: number;
	category: string;
	description: string;
	name: string;
}

export interface ITokenTransfer {
	action: ITokenTransferAction,
	data: string;
	miniBlockHash: string;
	originalTxHash: string;
	receiver: string;
	receiverShard: number;
	sender: string;
	senderShard: number;
	status: TransactionStatus;
	timestamp: number;
	txHash: string;
	type: 'Transaction' | 'SmartContractResult';
	value: string;
}
