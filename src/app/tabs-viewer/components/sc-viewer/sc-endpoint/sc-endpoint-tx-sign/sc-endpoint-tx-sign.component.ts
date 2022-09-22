import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SelectElement } from '../../../../../core/ui/select/select.component';
import { INetworkEnvironment } from '../../../../../core/elrond/interfaces/network-environment';
import { EndpointDefinition, SmartContract } from '@elrondnetwork/erdjs/out';
import { GeneratedWallet } from '../../../../../core/data-provider/data-provider';
import { ScTransactionRunner } from '../../../../../core/elrond/services/sc-transaction-runner';

@Component({
	selector: 'app-sc-endpoint-tx-sign',
	templateUrl: './sc-endpoint-tx-sign.component.html',
	styleUrls: ['./sc-endpoint-tx-sign.component.scss']
})
export class ScEndpointTxSignComponent implements OnInit, OnChanges {
	@Input() wallets: GeneratedWallet[] = [];

	@Input() network?: INetworkEnvironment;

	@Input() sender: string = '';

	@Input() sc!: SmartContract;

	@Input() endpoint!: EndpointDefinition;

	@Input() payload: any;

	@Output() onSubmit = new EventEmitter<{wallet: GeneratedWallet, fee: number}>();

	wallet?: GeneratedWallet;

	fee = 50_000;

	constructor(private readonly scTxRunner: ScTransactionRunner) {
	}

	ngOnInit(): void {
	}

	async ngOnChanges(changes: SimpleChanges): Promise<void> {
		await this.estimate();
	}

	async estimate(): Promise<void> {
		if (!this.network || !this.payload || !this.wallet) {
			return;
		}

		const fee = await this.scTxRunner.estimate(this.sc, {
			network: this.network,
			caller: this.wallet.address,
			payload: this.payload,
			value: {
				toString(): string {
					return '0';
				},
			},
			functionName: this.endpoint.name,
		});

		console.log('FEE = ' + fee);

		this.fee = fee;
	}

	async onSelectedWallet(event: SelectElement<GeneratedWallet>): Promise<void> {
		this.wallet = event.value;

		await this.estimate();
	}

	submit(fee: number): void {
		if (!this.wallet) {
			return;
		}

		this.onSubmit.emit({wallet: this.wallet, fee});
	}

	onChangeFee(e: Event): void {
		const value = +(<HTMLInputElement>e.target).value;

		if (value) {
			this.fee = value;
		}
	}
}
