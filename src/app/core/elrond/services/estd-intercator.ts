import {
	Interaction,
	SmartContract,
	TokenPayment,
	Address,
	SmartContractAbi,
	AbiRegistry,
	BytesValue,
	U32Value,
	BigUIntValue, AddressValue, TypedValue, Transaction, ContractFunction, TokenIdentifierValue,
} from '@elrondnetwork/erdjs/out';
import BigNumber from 'bignumber.js';
import { INetworkEnvironment } from '../interfaces/network-environment';
import { Injectable } from '@angular/core';
import * as estdAbi from '../abi/esdt.abi.json';
import { ScInteractor } from './sc-interactor';
import { ProjectWallet } from '../../data-provider/data-provider';
import { TxSender } from './tx.sender';
import { Observable } from 'rxjs';
import { GasLimit } from '../models/gas-limit';
import { ContractCallPayloadBuilder } from '@elrondnetwork/erdjs/out/smartcontracts/transactionPayloadBuilders';

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

export interface IMintBurnTokenOptions {
	identifier: string;
	supply: BigNumber.Value;
	mintedTokensOwner?: string;
}

export interface IFreezeUnFreezeOptions {
	identifier: string;
	address: string;
}

export interface IWipeOptions {
	identifier: string;
	address: string;
}

export interface ISetSpecialRolesOptions extends Record<string, any> {
	identifier: string;
	address: string;
	ESDTRoleLocalBurn?: boolean;
	ESDTRoleLocalMint?: boolean;
}

export interface ITransferOwnershipOptions {
	identifier: string;
	address: string;
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

	private readonly estdSpecialRoles = [
		'ESDTRoleLocalBurn',
		'ESDTRoleLocalMint',
	];

	constructor(private readonly txRunner: ScInteractor,
				private readonly txSender: TxSender,) {
		const abi = (estdAbi as any).default;
		this.contract = new SmartContract({
			address: this.estdContractAddress,
			abi: new SmartContractAbi(AbiRegistry.create(abi)),
		});
	}

	issueFungibleToken(projectId: string,
					   network: INetworkEnvironment,
					   wallet: ProjectWallet,
					   options: IIssueTokenOptions): Observable<string> {
		const args: any[] = [
			BytesValue.fromUTF8(options.name),
			BytesValue.fromUTF8(options.ticker),
			new BigUIntValue(options.supply),
			new U32Value(options.decimals),
		];

		for (const prop of this.esdtTokenProperties) {
			const propertyEnabled = !!(options as any)[prop];

			args.push(BytesValue.fromUTF8(prop));
			args.push(BytesValue.fromUTF8(propertyEnabled.toString()));
		}

		const interaction = <Interaction>this.contract.methodsExplicit
			.issue(args)
			.withValue(TokenPayment.egldFromAmount(this.issuePriceInEgld))
			.withChainID(network.chainId);

		const tx = interaction.buildTransaction();

		tx.setGasLimit(new GasLimit(60_000_000));

		return this.txSender.send(projectId, wallet, tx);
	}

	mint(projectId: string,
		 network: INetworkEnvironment,
		 wallet: ProjectWallet,
		 options: IMintBurnTokenOptions): Observable<string> {
		const txPayload = new ContractCallPayloadBuilder()
			.setFunction(new ContractFunction('ESDTLocalMint'))
			.setArgs([
				new TokenIdentifierValue(options.identifier),
				new BigUIntValue(options.supply),
			])
			.build();

		const tx = new Transaction({
			gasLimit: new GasLimit(3_000_000),
			sender: new Address(wallet.address),
			receiver: new Address(wallet.address),
			chainID: network.chainId,
			data: txPayload,
		});

		tx.setGasLimit(new GasLimit(3_000_000));

		return this.txSender.send(projectId, wallet, tx);
	}

	burn(projectId: string,
		 network: INetworkEnvironment,
		 wallet: ProjectWallet,
		 options: IMintBurnTokenOptions): Observable<string> {
		const txPayload = new ContractCallPayloadBuilder()
			.setFunction(new ContractFunction('ESDTLocalBurn'))
			.setArgs([
				new TokenIdentifierValue(options.identifier),
				new BigUIntValue(options.supply),
			])
			.build();

		const tx = new Transaction({
			gasLimit: new GasLimit(3_000_000),
			sender: new Address(wallet.address),
			receiver: new Address(wallet.address),
			chainID: network.chainId,
			data: txPayload,
		});

		return this.txSender.send(projectId, wallet, tx);
	}

	pause(projectId: string,
		  network: INetworkEnvironment,
		  wallet: ProjectWallet,
		  identifier: string): Observable<string> {
		const args: TypedValue[] = [
			BytesValue.fromUTF8(identifier),
		];

		const interaction = <Interaction>this.contract.methodsExplicit
			.pause(args)
			.withChainID(network.chainId);

		const tx = interaction.buildTransaction();

		tx.setGasLimit(new GasLimit(55_000_000));

		return this.txSender.send(projectId, wallet, tx);
	}

	unPause(projectId: string,
			network: INetworkEnvironment,
			wallet: ProjectWallet,
			identifier: string): Observable<string> {
		const args: TypedValue[] = [
			BytesValue.fromUTF8(identifier),
		];

		const interaction = <Interaction>this.contract.methodsExplicit
			.unPause(args)
			.withChainID(network.chainId);

		const tx = interaction.buildTransaction();

		tx.setGasLimit(new GasLimit(55_000_000));

		return this.txSender.send(projectId, wallet, tx);
	}

	freeze(projectId: string,
		   network: INetworkEnvironment,
		   wallet: ProjectWallet,
		   options: IFreezeUnFreezeOptions): Observable<string> {
		const args: TypedValue[] = [
			BytesValue.fromUTF8(options.identifier),
			new AddressValue(new Address(options.address)),
		];

		const interaction = <Interaction>this.contract.methodsExplicit
			.freeze(args)
			.withChainID(network.chainId);

		const tx = interaction.buildTransaction();

		tx.setGasLimit(new GasLimit(55_000_000));

		return this.txSender.send(projectId, wallet, tx);
	}

	unFreeze(projectId: string,
			 network: INetworkEnvironment,
			 wallet: ProjectWallet,
			 options: IFreezeUnFreezeOptions): Observable<string> {
		const args: TypedValue[] = [
			BytesValue.fromUTF8(options.identifier),
			new AddressValue(new Address(options.address)),
		];

		const interaction = <Interaction>this.contract.methodsExplicit
			.unFreeze(args)
			.withChainID(network.chainId);

		const tx = interaction.buildTransaction();

		tx.setGasLimit(new GasLimit(55_000_000));

		return this.txSender.send(projectId, wallet, tx);
	}

	wipe(projectId: string,
		 network: INetworkEnvironment,
		 wallet: ProjectWallet,
		 options: IWipeOptions): Observable<string> {
		const args: TypedValue[] = [
			BytesValue.fromUTF8(options.identifier),
			new AddressValue(new Address(options.address)),
		];

		const interaction = <Interaction>this.contract.methodsExplicit
			.wipe(args)
			.withChainID(network.chainId);

		const tx = interaction.buildTransaction();

		tx.setGasLimit(new GasLimit(55_000_000));

		return this.txSender.send(projectId, wallet, tx);
	}

	setSpecialRoles(projectId: string,
					network: INetworkEnvironment,
		 			wallet: ProjectWallet,
		 			options: ISetSpecialRolesOptions): Observable<string> {
		const args: TypedValue[] = [
			BytesValue.fromUTF8(options.identifier),
			new AddressValue(new Address(options.address)),
		];

		for (const role of this.estdSpecialRoles) {
			const roleEnabled = !!options[role];

			if (roleEnabled) {
				args.push(BytesValue.fromUTF8(role));
			}
		}

		const interaction = <Interaction>this.contract.methodsExplicit
			.setSpecialRole(args)
			.withChainID(network.chainId);

		const tx = interaction.buildTransaction();

		tx.setGasLimit(new GasLimit(55_000_000));

		return this.txSender.send(projectId, wallet, tx);
	}

	transferOwnership(projectId: string,
					  network: INetworkEnvironment,
					  wallet: ProjectWallet,
					  options: ITransferOwnershipOptions): Observable<string> {
		const args: TypedValue[] = [
			BytesValue.fromUTF8(options.identifier),
			new AddressValue(new Address(options.address)),
		];

		const interaction = <Interaction>this.contract.methodsExplicit
			.transferOwnership(args)
			.withChainID(network.chainId);

		const tx = interaction.buildTransaction();

		tx.setGasLimit(new GasLimit(55_000_000));

		return this.txSender.send(projectId, wallet, tx);
	}
}
