import { Injectable } from '@angular/core';
import {
	ContractFunction,
	ITransactionValue,
	SmartContract,
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

export interface IScTxOptions {
	network: INetworkEnvironment;
	payload: any;
	functionName: string;
	value?: ITransactionValue;
	gasLimit: number;
	caller: string;
	walletCredentials: WalletCredentialsAware;
}

@Injectable({providedIn: 'root'})
export class ScTransactionRunner {
	constructor(private readonly proxy: ElrondProxyProvider,
				private readonly elrondDataProvider: ElrondDataProvider) {
	}

	async run(sc: SmartContract, options: IScTxOptions): Promise<string> {
		const scFn = sc.getEndpoint(options.functionName);

		if (!scFn) {
			throw new Error(`Sc function "${options.functionName}" not found`);
		}

		if (scFn.modifiers.isReadonly()) {
			throw new Error(`Sc function "${options.functionName}" is readonly`);
		}

		const tx = sc.call({
			func: new ContractFunction(scFn.name),
			gasLimit: {
				valueOf(): number {
					return options.gasLimit;
				},
			},
			chainID: {
				valueOf(): string {
					return options.network.chainId;
				}
			},
			args: new ScArgsBuilder(sc).build(options.functionName, options.payload),
		});

		const callerAccount = await this.elrondDataProvider.getAccountInfo(options.network, options.caller).toPromise();

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
