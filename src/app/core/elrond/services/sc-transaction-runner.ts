import { Injectable } from '@angular/core';
import {
	ContractFunction, Interaction,
	SmartContract, TokenPayment, Transaction,
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
	payment?: TokenPayment;
	caller: string;
}

export interface IScTxOptions extends IScCallOptions {
	gasLimit: number;
	walletCredentials: WalletCredentialsAware;
}

export interface ISignAndSendTxOptions {
	network: INetworkEnvironment,
	credentials: WalletCredentialsAware;
	gasLimit: number;
	caller: string;
}

@Injectable({providedIn: 'root'})
export class ScTransactionRunner {
	constructor(private readonly proxy: ElrondProxyProvider,
				private readonly elrondDataProvider: ElrondDataProvider) {
	}

	async createTx(sc: SmartContract, options: IScCallOptions): Promise<Transaction> {
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

		const callerAccount = await this.elrondDataProvider.getAccountInfo(options.network, options.caller).toPromise();

		interaction
			.withNonce(callerAccount.nonce)
			.withChainID(options.network.chainId);

		if (options.payment) {
			interaction.withValue(options.payment);
		}

		const tx = interaction.buildTransaction();

		tx['sender'] = callerAccount.address;

		return tx;
	}

	async estimate(sc: SmartContract, options: IScCallOptions): Promise<number> {
		const tx = await this.createTx(sc, options);

		return this.elrondDataProvider.estimateTransactionConst(options.network, tx).toPromise();
	}

	async run(sc: SmartContract, options: IScTxOptions): Promise<string> {
		const tx = await this.createTx(sc, options);

		return this.signAndSendTx(tx, {
			network: options.network,
			credentials: options.walletCredentials,
			caller: options.caller,
			gasLimit: options.gasLimit,
		});
	}

	async signAndSendTx(tx: Transaction, options: ISignAndSendTxOptions): Promise<string> {
		const callerAccount = await this.elrondDataProvider.getAccountInfo(options.network, options.caller).toPromise();

		tx.setGasLimit(options.gasLimit);

		tx.setNonce(callerAccount.nonce);

		const signer = this.getSigner(options.credentials);

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
