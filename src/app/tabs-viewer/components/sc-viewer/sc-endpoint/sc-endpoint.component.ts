import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ScInputComponent } from './sc-input/sc-input.component';
import { EndpointDefinition, SmartContract, TypedOutcomeBundle } from '@elrondnetwork/erdjs/out';
import { Observable, of, Subject } from 'rxjs';
import { ScQueryRunner } from '../../../../core/elrond/services/sc-query-runner';
import { INetworkEnvironment } from '../../../../core/elrond/interfaces/network-environment';
import { Store } from '@ngrx/store';
import { NetworkSelector } from '../../../../network/store/network.selector';
import { IGeneratedWallet } from '../../../../project/components/dialogs/generate-wallet-dialog/generate-wallet-dialog.component';
import { ScTransactionRunner } from '../../../../core/elrond/services/sc-transaction-runner';
import { Mnemonic } from '@elrondnetwork/erdjs-walletcore/out';

@Component({
	selector: 'app-sc-endpoint',
	templateUrl: './sc-endpoint.component.html',
	styleUrls: ['./sc-endpoint.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ScInputComponent),
			multi: true
		},
	],
})
export class ScEndpointComponent implements OnInit {
	isShowing = false;

	@Input() sc!: SmartContract;

	@Input() endpoint?: EndpointDefinition;

	@Input() chainId!: string;

	@Input() wallets: IGeneratedWallet[] = [];

	form!: FormGroup;

	queryResultSubject = new Subject<TypedOutcomeBundle>();

	txResultSubject = new Subject<string>();

	network$?: Observable<INetworkEnvironment | undefined>;

	constructor(private readonly fb: FormBuilder,
				private readonly store: Store,
				private readonly scQueryRunner: ScQueryRunner,
				private readonly scTxRunner: ScTransactionRunner) {

	}

	ngOnInit(): void {
		this.network$ = this.store.select(NetworkSelector.networkByChainId(this.chainId));

		this.form = this.fb.group(
			(this.endpoint?.input || [])
				.map(i => ({[i.name]: new FormControl('')}))
				.reduce((p, c) => ({...p, ...c}), {}),
		);
	}

	show(event: Event): void {
		event.stopPropagation();
		this.isShowing = true;
	}

	hide(event: Event): void {
		event.stopPropagation();
		this.isShowing = false;
	}

	getArgsPreview(): string {
		const args = (this.endpoint?.input || []).map(i => `${i.name}: ${i.type}`);

		return `(${args.join(', ')})`;
	}

	async sendQuery(network: INetworkEnvironment): Promise<void> {
		if (!this.endpoint) {
			return;
		}

		const query = this.scQueryRunner.createQuery(this.sc, {
			payload: this.form.value,
			functionName: this.endpoint.name,
		});

		const queryResult = await this.scQueryRunner.runQuery(network, this.sc, query);

		this.queryResultSubject.next(queryResult);
	}

	async submitTransaction(network: INetworkEnvironment, wallet: IGeneratedWallet, gasLimit: number): Promise<void> {
		if (!this.endpoint) {
			return;
		}

		const txHash = await this.scTxRunner.run(this.sc, {
			payload: this.form.value,
			functionName: this.endpoint.name,
			network,
			value: 0,
			gasLimit,
			caller: Mnemonic.fromString(wallet.mnemonic.join(' ')).deriveKey(0).generatePublicKey().toAddress().bech32(),
			walletCredentials: {mnemonic: wallet.mnemonic},
		});

		this.txResultSubject.next(txHash);
	}
}
