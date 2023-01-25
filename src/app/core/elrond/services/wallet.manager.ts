import { Injectable } from '@angular/core';
import BigNumber from 'bignumber.js';
import { Address, Transaction, TransactionPayload } from '@multiversx/sdk-core/out';
import { INetworkEnvironment } from '../interfaces/network-environment';
import { ProjectWallet } from '../../data-provider/data-provider';
import { DecimalPlacesHelper } from '../helpers/decimal-places.helper';
import { TxSender } from './tx.sender';
import { Observable } from 'rxjs';

export interface ITokenTransferOptions {
	sender: string;
	receiver: string;
	identifier: string;
	decimals: number;
	amount: BigNumber.Value;
	data?: string;
	gasLimit: number;
	wallet: ProjectWallet;
}

@Injectable({providedIn: 'root'})
export class WalletManager {
	constructor(private readonly txSender: TxSender) {
	}

	transferFunds(projectId: string,
				  network: INetworkEnvironment,
				  wallet: ProjectWallet,
				  options: ITokenTransferOptions): Observable<string> {
		const transactionPayload = new TransactionPayload(options.data || '');

		const tx = new Transaction({
			data: transactionPayload,
			gasLimit: options.gasLimit,
			sender: new Address(options.sender),
			receiver: new Address(options.receiver),
			value: 0,
			chainID: network.chainId,
		});

		if (options.identifier === network.egldLabel) {
			const amount = DecimalPlacesHelper.toRaw(options.decimals, options.amount);
			tx.setValue(amount);
		}

		return this.txSender.send(projectId, wallet, tx);
	}
}
