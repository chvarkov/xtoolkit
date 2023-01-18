import { Injectable } from '@angular/core';
import { Address, Transaction } from '@multiversx/sdk-core';
import { ProjectWallet } from '../../data-provider/data-provider';
import { INetworkEnvironment } from '../interfaces/network-environment';
import { ElrondDataProvider } from '../elrond.data-provider';

@Injectable({providedIn: 'root'})
export class TxEstimator {
	constructor(private readonly elrondDataProvider: ElrondDataProvider) {
	}

	async estimate(tx: Transaction, wallet: ProjectWallet, network: INetworkEnvironment): Promise<number> {
		tx['sender'] = new Address(wallet.address);

		const account = await this.elrondDataProvider.getAccountInfo(network, wallet.address).toPromise();

		tx.setNonce(account.nonce);

		return this.elrondDataProvider.estimateTransactionCost(network, tx).toPromise();
	}
}
