import { TransactionStatus } from '../enums/transaction-status';

export interface IElrondReceiverAssets {
	name: string;
	description: string;
	tags: string[];
	iconPng: string;
	iconSvg: string;
}

export interface IElrondAction {
	category: string;
	name: string;
}

export interface IElrondTransaction {
	txHash: string;
	gasLimit: number;
	gasPrice: number;
	gasUsed: number;
	miniBlockHash: string;
	nonce: string;
	receiver: IElrondReceiverAssets;
	receiverShard: number;
	round: number;
	sender: string;
	senderShard: number;
	signature: number;
	status: TransactionStatus;
	value: string;
	fee: string;
	timestamp: number;
	data: string;
	function: string;
	action: IElrondAction;
}
