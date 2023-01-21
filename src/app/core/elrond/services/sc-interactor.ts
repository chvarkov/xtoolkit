import { Injectable } from '@angular/core';
import {
	Address,
	ContractFunction, Interaction,
	SmartContract, TokenPayment, Transaction,
} from '@multiversx/sdk-core/out';
import { ScArgsBuilder } from '../builders/sc-args.builder';
import { ElrondDataProvider } from '../elrond.data-provider';
import { INetworkEnvironment } from '../interfaces/network-environment';
import { ElrondProxyProvider } from './elrond-proxy-provider';
import { ProjectWallet } from '../../data-provider/data-provider';
import { TxSender } from './tx.sender';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TxEstimator } from './tx-estimator';

export interface IScTxOptions {
	network: INetworkEnvironment;
	payload: any;
	functionName: string;
	payment?: TokenPayment;
	wallet: ProjectWallet;
}

export interface IScCallOptions extends IScTxOptions {
	projectId: string;
	gasLimit: number;
}

@Injectable({providedIn: 'root'})
export class ScInteractor {
	constructor(private readonly proxy: ElrondProxyProvider,
				private readonly txSender: TxSender,
				private readonly txEstimator: TxEstimator) {
	}

	createTx(sc: SmartContract, options: IScTxOptions): Transaction {
		const scFn = sc.getEndpoint(options.functionName);

		if (!scFn) {
			throw new Error(`Sc function "${options.functionName}" not found`);
		}

		if (scFn.modifiers.isReadonly()) {
			throw new Error(`Sc function "${options.functionName}" is readonly`);
		}

		let contractFunction = new ContractFunction(options.functionName);
		let args = new ScArgsBuilder(sc).build(options.functionName, options.payload);
		let interaction = new Interaction(sc, contractFunction, args);

		interaction
			.withChainID(options.network.chainId);

		if (options.payment) {
			interaction.withValue(options.payment);
		}

		return interaction.buildTransaction();
	}

	async estimateScCall(sc: SmartContract, options: IScTxOptions): Promise<number> {
		const tx = await this.createTx(sc, options);

		return this.txEstimator.estimate(tx, options.wallet, options.network)
	}

	call(sc: SmartContract, options: IScCallOptions): Observable<string> {
		const tx = this.createTx(sc, options);

		tx.setGasLimit(options.gasLimit);

		return this.txSender.send(options.projectId, options.wallet, tx).pipe(
			tap((v) => console.log('txHash: ' + v)),
		);
	}
}
