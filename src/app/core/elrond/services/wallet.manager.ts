import { Injectable } from '@angular/core';
import BigNumber from 'bignumber.js';
import { Address, Transaction, TransactionPayload } from '@elrondnetwork/erdjs/out';
import { INetworkEnvironment } from '../interfaces/network-environment';
import { ScTransactionRunner } from './sc-transaction-runner';
import { GeneratedWallet } from '../../data-provider/data-provider';

export interface ITokenTransferOptions {
	sender: string;
	receiver: string;
	identifier: string;
	amount: BigNumber.Value;
	data?: string;
	gasLimit: number;
	wallet: GeneratedWallet;
}

@Injectable({providedIn: 'root'})
export class WalletManager {
	constructor(private readonly txRunner: ScTransactionRunner) {
	}

	async transferFunds(network: INetworkEnvironment,
						wallet: GeneratedWallet,
						options: ITokenTransferOptions): Promise<string> {


		const tx = new Transaction({
			data: new TransactionPayload(options.data || ''),
			gasLimit: options.gasLimit,
			sender: new Address(options.sender),
			receiver: new Address(options.receiver),
			value: options.amount,
			chainID: network.chainId,
		});

		return this.txRunner.signAndSendTx(tx, {
			network,
			gasLimit: options.gasLimit,
			caller: options.sender,
			credentials: {
				mnemonic: wallet.mnemonic,
			},
		});
	}
}
