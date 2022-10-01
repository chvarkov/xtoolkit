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
	receiver: string;
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

export interface ITxLogEvent {
	identifier: string;
	address: string;
	data: string;
	topics: string[];
	order: 0;
}

export interface ITxOperation {
	id: string;
	action: 'transfer' | string;
	type: 'estd' | 'signalError';
	sender: string;
	receiver: string;
	data: string;
	message: string;
	decimals?: number;
	esdtType?: 'FungibleESDT';
	identifier?: string;
	value?: string;
	name?: string;
}

export interface ITxScResult {
	callType: string;
	data: string;
	gasLimit: number;
	gasPrice: number;
	hash: string;
	nonce: number;
	originalTxHash: string;
	prevTxHash: string;
	receiver: string;
	sender: string;
	timestamp: number;
	value: string;
}

export interface IElrondFullTransaction {
	txHash: string;
	gasLimit: number;
	gasPrice: number;
	gasUsed: number;
	miniBlockHash: string;
	nonce: string;
	receiver: string;
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
	price: string;
	function?: string;
	action?: IElrondAction;
	logs: {
		id: string;
		address: string;
		events: ITxLogEvent[],
	},
	operations: ITxOperation[];
	results?: ITxScResult[];
}
