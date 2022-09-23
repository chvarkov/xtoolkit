import {
	Interaction,
	SmartContract, TokenPayment, Transaction, Account, Address, SmartContractAbi, AbiRegistry,
} from '@elrondnetwork/erdjs/out';
import BigNumber from 'bignumber.js';
import { INetworkEnvironment } from '../interfaces/network-environment';
import { Injectable } from '@angular/core';
import * as estdAbi from '../abi/esdt.abi.json';
import { ScTransactionRunner } from './sc-transaction-runner';
import { GeneratedWallet } from '../../data-provider/data-provider';

export interface IIssueTokenOptions {
	name: string,
	ticker: string,
	supply: BigNumber.Value,
	decimals: number
}

@Injectable({providedIn: 'root'})
export class ESDTInteractor {
	private readonly estdContractAddress = new Address('erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u');
	private readonly issuePriceInEgld = new BigNumber(0.05);
	private readonly contract: SmartContract;

	constructor(private readonly txRunner: ScTransactionRunner) {
		const abi = (estdAbi as any).default;
		this.contract = new SmartContract({
			address: this.estdContractAddress,
			abi: new SmartContractAbi(AbiRegistry.create(abi)),
		});
	}

	async issueFungibleToken(network: INetworkEnvironment,
							 wallet: GeneratedWallet,
							 token: IIssueTokenOptions): Promise<string> {
		const interaction = <Interaction>this.contract.methods
			.issue([
				token.name,
				token.ticker,
				token.supply,
				token.decimals
			])
			.withValue(TokenPayment.egldFromAmount(this.issuePriceInEgld))
			.withChainID(network.chainId);

		const tx = interaction.buildTransaction();

		return this.txRunner.signAndSendTx(tx, {
			network,
			gasLimit: 60000000,
			caller: wallet.address,
			credentials: {
				mnemonic: wallet.mnemonic,
			},
		});
	}
}
