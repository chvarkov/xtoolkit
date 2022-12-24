import {
	Interaction,
	SmartContract,
	TokenPayment,
	Address,
	SmartContractAbi,
	AbiRegistry,
	BytesValue,
	U32Value,
	BigUIntValue, AddressValue,
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
	decimals: number;
	canFreeze?: boolean;
	canWipe?: boolean;
	canPause?: boolean;
	canMint?: boolean;
	canBurn?: boolean;
	canChangeOwner?: boolean;
	canUpgrade?: boolean;
	canAddSpecialRoles?: boolean;
}

export interface IMintTokenOptions {
	identifier: string;
	supply: BigNumber.Value;
	mintedTokensOwner: string;
}

@Injectable({providedIn: 'root'})
export class ESDTInteractor {
	private readonly estdContractAddress = new Address('erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u');
	private readonly issuePriceInEgld = new BigNumber(0.05);
	private readonly contract: SmartContract;

	private readonly esdtTokenProperties = [
		'canFreeze',
		'canWipe',
		'canPause',
		'canMint',
		'canBurn',
		'canChangeOwner',
		'canUpgrade',
		'canAddSpecialRoles',
	];

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
		const args: any[] = [
			BytesValue.fromUTF8(token.name),
			BytesValue.fromUTF8(token.ticker),
			new BigUIntValue(token.supply),
			new U32Value(token.decimals),
		];

		for (const prop of this.esdtTokenProperties) {
			const propertyEnabled = !!(token as any)[prop];

			args.push(BytesValue.fromUTF8(prop));
			args.push(BytesValue.fromUTF8(propertyEnabled.toString()));
		}

		const interaction = <Interaction>this.contract.methodsExplicit
			.issue(args)
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

	async mint(network: INetworkEnvironment,
			   wallet: GeneratedWallet,
			   options: IMintTokenOptions): Promise<string> {
		console.log('options', options);
		const args: any[] = [
			BytesValue.fromUTF8(options.identifier),
			new BigUIntValue(new BigNumber(options.supply)),
			new AddressValue(new Address(options.mintedTokensOwner)),
		];

		const interaction = <Interaction>this.contract.methodsExplicit
			.mint(args)
			.withValue(TokenPayment.egldFromAmount(this.issuePriceInEgld))
			.withChainID(network.chainId);

		const tx = interaction.buildTransaction();

		return this.txRunner.signAndSendTx(tx, {
			network,
			gasLimit: 3_000_000,
			caller: wallet.address,
			credentials: {
				mnemonic: wallet.mnemonic,
			},
		});
	}
}
