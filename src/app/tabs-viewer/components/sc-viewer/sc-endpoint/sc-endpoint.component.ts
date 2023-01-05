import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ScInputComponent } from './sc-input/sc-input.component';
import { EndpointDefinition, SmartContract, TokenPayment, TypedOutcomeBundle } from '@elrondnetwork/erdjs/out';
import { Observable, Subject } from 'rxjs';
import { ScQueryRunner } from '../../../../core/elrond/services/sc-query-runner';
import { INetworkEnvironment } from '../../../../core/elrond/interfaces/network-environment';
import { Store } from '@ngrx/store';
import { NetworkSelector } from '../../../../network/store/network.selector';
import { ScInteractor } from '../../../../core/elrond/services/sc-interactor';
import { Mnemonic } from '@elrondnetwork/erdjs-walletcore/out';
import { ActionHistoryAction } from '../../../../action-history/store/action-history.action';
import { ActionStatus, ActionType, ProjectWallet } from '../../../../core/data-provider/data-provider';
import * as uuid from 'uuid';
import { TxSender } from '../../../../core/elrond/services/tx.sender';

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

	@Input() projectId!: string;

	@Input() sc!: SmartContract;

	@Input() endpoint?: EndpointDefinition;

	@Input() chainId!: string;

	@Input() wallets: ProjectWallet[] = [];

	form!: FormGroup;

	queryResultSubject = new Subject<TypedOutcomeBundle>();

	txResultSubject = new Subject<string>();

	network$?: Observable<INetworkEnvironment | undefined>;

	payload$?: Observable<any>;

	constructor(private readonly fb: FormBuilder,
				private readonly store: Store,
				private readonly scQueryRunner: ScQueryRunner,
				private readonly txSender: TxSender,
				private readonly scTxRunner: ScInteractor) {

	}

	ngOnInit(): void {
		this.network$ = this.store.select(NetworkSelector.networkByChainId(this.chainId));

		this.form = this.fb.group(
			(this.endpoint?.input || [])
				.map(i => ({[i.name]: new FormControl('')}))
				.reduce((p, c) => ({...p, ...c}), {}),
		);

		this.payload$ = this.form.valueChanges;
	}

	show(event?: Event): void {
		event?.stopPropagation();
		this.isShowing = true;
	}

	hide(event?: Event): void {
		event?.stopPropagation();
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

	async submitTransaction(network: INetworkEnvironment,
							wallet: ProjectWallet,
							gasLimit: number,
							payment?: TokenPayment): Promise<void> {
		if (!this.endpoint) {
			return;
		}

		try {
			const txHash = await this.scTxRunner.run(this.sc, {
				payload: this.form.value,
				functionName: this.endpoint.name,
				network,
				gasLimit,
				payment,
				wallet,
				projectId: this.projectId,
			}).toPromise();

			this.txResultSubject.next(txHash);

			this.store.dispatch(ActionHistoryAction.logAction({
				data: {
					id: uuid.v4(),
					projectId: this.projectId,
					chainId: this.chainId,
					type: ActionType.Tx,
					title: this.endpoint.name,
					timestamp: Date.now(),
					status: ActionStatus.Pending,
					txHash,
					caller: wallet.address,
					data: {
						payload: this.transformActionData(this.form.value),
					},
				},
			}));
		} catch (e) {
			this.store.dispatch(ActionHistoryAction.logAction({
				data: {
					id: uuid.v4(),
					projectId: this.projectId,
					chainId: this.chainId,
					type: ActionType.Tx,
					title: this.endpoint.name,
					timestamp: Date.now(),
					status: ActionStatus.Fail,
					caller: wallet.address,
					data: {
						payload: this.transformActionData(this.form.value),
					},
				},
			}));
			throw e;
		}
	}

	private transformActionData(data: any): any {
		if (data instanceof Buffer) {
			return data.toString('hex');
		}

		if (typeof data === 'object') {
			Object.keys(data).forEach(key => {
				data[key] = this.transformActionData(data[key]);
			});

			return data;
		}

		if (Array.isArray(data)) {
			data.forEach((item, index) => {
				data[index] = this.transformActionData(item);
			});
		}

		return data;
	}
}
