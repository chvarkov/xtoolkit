import { Injectable } from '@angular/core';
import {
	ContractFunction,
	ITransactionValue,
	SmartContract, Transaction,
} from '@elrondnetwork/erdjs/out';
import { ScArgsBuilder } from '../builders/sc-args.builder';
import { ElrondDataProvider } from '../elrond.data-provider';
import { INetworkEnvironment } from '../interfaces/network-environment';
import { Mnemonic, UserSigner } from '@elrondnetwork/erdjs-walletcore/out';
import { UserSecretKey } from '@elrondnetwork/erdjs-walletcore/out/userKeys';
import { ElrondProxyProvider } from './elrond-proxy-provider';

export interface IMnemonicAware {
	mnemonic: string[];
}

export interface ISecretKeyAware {
	secretKey: string;
}

export type WalletCredentialsAware = IMnemonicAware | ISecretKeyAware;

export interface IScCallOptions {
	network: INetworkEnvironment;
	payload: any;
	functionName: string;
	value?: ITransactionValue;
	caller: string;
}

export interface IScTxOptions extends IScCallOptions {
	gasLimit: number;
	walletCredentials: WalletCredentialsAware;
}

@Injectable({providedIn: 'root'})
export class ScTransactionRunner {
	constructor(private readonly proxy: ElrondProxyProvider,
				private readonly elrondDataProvider: ElrondDataProvider) {
	}

	createTx(sc: SmartContract, options: IScCallOptions): Transaction {
		const scFn = sc.getEndpoint(options.functionName);

		if (!scFn) {
			throw new Error(`Sc function "${options.functionName}" not found`);
		}

		if (scFn.modifiers.isReadonly()) {
			throw new Error(`Sc function "${options.functionName}" is readonly`);
		}

		return sc.call({
			func: new ContractFunction(scFn.name),
			gasLimit: {
				valueOf(): number {
					return 0;
				},
			},
			chainID: {
				valueOf(): string {
					return options.network.chainId;
				}
			},
			args: new ScArgsBuilder(sc).build(options.functionName, options.payload),
		});
	}

	async estimate(sc: SmartContract, options: IScCallOptions): Promise<number> {
		const tx = this.createTx(sc, options);

		const callerAccount = await this.elrondDataProvider.getAccountInfo(options.network, options.caller).toPromise()

		return this.elrondDataProvider.estimateTransactionConst(options.network, {
			version: 1,
			chainID: tx.getChainID().valueOf(),
			sender: options.caller,
			value: tx.getValue().toString(),
			receiver: sc.getAddress().bech32(),
			data: tx.getData().encoded(),
			nonce: callerAccount.nonce,
		}).toPromise();
	}

	async run(sc: SmartContract, options: IScTxOptions): Promise<string> {
		const tx = this.createTx(sc, options);

		const callerAccount = await this.elrondDataProvider.getAccountInfo(options.network, options.caller).toPromise();

		tx.setGasLimit(options.gasLimit);

		tx.setNonce(callerAccount.nonce);

		const signer = this.getSigner(options.walletCredentials);

		await signer.sign(tx);

		return this.proxy.getProxy(options.network).sendTransaction(tx);
	}

	getSigner(creds: WalletCredentialsAware): UserSigner {
		if (this.isMnemonic(creds)) {
			return new UserSigner(Mnemonic.fromString(creds.mnemonic.join(' ')).deriveKey(0));
		}

		if (this.isSecretKey(creds)) {
			return new UserSigner(UserSecretKey.fromString(creds.secretKey));
		}

		throw new Error('Cannot resolve user signer');
	}

	isMnemonic(creds: WalletCredentialsAware): creds is IMnemonicAware {
		return creds.hasOwnProperty('mnemonic');
	}

	isSecretKey(creds: WalletCredentialsAware): creds is ISecretKeyAware {
		return creds.hasOwnProperty('secretKey');
	}
}
