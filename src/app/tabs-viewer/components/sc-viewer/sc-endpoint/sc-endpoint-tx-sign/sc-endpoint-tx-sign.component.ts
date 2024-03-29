import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { INetworkEnvironment } from '../../../../../core/elrond/interfaces/network-environment';
import { EndpointDefinition, SmartContract, TokenIdentifierValue, TokenPayment } from '@multiversx/sdk-core/out';
import { ProjectWallet } from '../../../../../core/data-provider/data-provider';
import { ScInteractor } from '../../../../../core/elrond/services/sc-interactor';
import BigNumber from 'bignumber.js';

@Component({
	selector: 'app-sc-endpoint-tx-sign',
	templateUrl: './sc-endpoint-tx-sign.component.html',
	styleUrls: ['./sc-endpoint-tx-sign.component.scss']
})
export class ScEndpointTxSignComponent implements OnInit, OnChanges {
	@Input() projectId: string = '';

	@Input() wallets: ProjectWallet[] = [];

	@Input() network?: INetworkEnvironment;

	@Input() sender: string = '';

	@Input() sc!: SmartContract;

	@Input() endpoint!: EndpointDefinition;

	@Input() payload: any;

	@Output() onSubmit = new EventEmitter<{wallet: ProjectWallet, fee: number, payment?: TokenPayment}>();

	wallet?: ProjectWallet;

	tokenAmount = 0;

	tokenIdentifier = TokenIdentifierValue.egld();

	fee = 50_000;

	constructor(private readonly scTxRunner: ScInteractor) {
	}

	ngOnInit(): void {
	}

	async ngOnChanges(changes: SimpleChanges): Promise<void> {
		await this.estimate();
	}

	async estimate(): Promise<void> {
		if (!this.network || !this.wallet || (!this.payload && this.endpoint.input.length)) {
			return;
		}

		const fee = await this.scTxRunner.estimateScCall(this.sc, {
			network: this.network,
			wallet: this.wallet,
			payload: this.payload,
			functionName: this.endpoint.name,
		});

		console.log('FEE = ' + fee);

		this.fee = fee;
	}

	async onSelectedWallet(wallet: ProjectWallet): Promise<void> {
		this.wallet = wallet;

		await this.estimate();
	}

	submit(): void {
		if (!this.wallet) {
			return;
		}

		const payment = this.endpoint.modifiers.isPayable()
			? TokenPayment.fungibleFromAmount(this.tokenIdentifier.toString(), new BigNumber(this.tokenAmount), 0)
			: undefined;

		this.onSubmit.emit({wallet: this.wallet, fee: this.fee, payment});
	}

	onChangeFee(e: Event): void {
		const value = +(<HTMLInputElement>e.target).value;

		if (value) {
			this.fee = value;
		}
	}

	onChangeTokenAmount(e: Event): void {
		const value = +(<HTMLInputElement>e.target).value;

		if (value) {
			this.tokenAmount = value;
		}
	}

	onChangeTokenIdentifier(value: string): void {
		if (value) {
			this.tokenIdentifier = TokenIdentifierValue.esdtTokenIdentifier(value);
		}
	}
}
