import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
	ActionHistoryElement, ActionStatus, ActionType,
	DATA_PROVIDER,
	DataProvider,
	Project,
	ProjectAbi,
	ProjectWallet
} from '../../../core/data-provider/data-provider';
import { Store } from '@ngrx/store';
import { ProjectSelector } from '../../../project/store/project.selector';
import { map, take, tap } from 'rxjs/operators';
import { SmartContract, Transaction } from '@multiversx/sdk-core';
import { ScBuilder } from '../../../core/elrond/builders/sc.builder';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ScArgsBuilder } from '../../../core/elrond/builders/sc-args.builder';
import { TxSender } from '../../../core/elrond/services/tx.sender';
import { TxEstimator } from '../../../core/elrond/services/tx-estimator';
import { NetworkSelector } from '../../../network/store/network.selector';
import * as uuid from 'uuid';
import { ActionHistoryAction } from '../../../action-history/store/action-history.action';
import { Address, AddressValue, BigUIntValue } from '@multiversx/sdk-core/out';

@Component({
	selector: 'app-deploy-sc',
	templateUrl: './deploy-sc.component.html',
	styleUrls: ['./deploy-sc.component.scss']
})
export class DeployScComponent implements OnInit {
	activeProject$: Observable<Project | undefined>;

	abiInterfaces$: Observable<ProjectAbi[]>;

	wallets$: Observable<ProjectWallet[]>;

	wasmCode!: string;

	selectedWallet!: ProjectWallet;
	selectedAbi!: ProjectAbi;
	sc!: SmartContract;

	form?: FormGroup;

	scMetadata: string = '';

	gasLimit = 100_000;

	constructor(private readonly store: Store,
				private readonly txSender: TxSender,
				private readonly txEstimator: TxEstimator,
				private readonly fb: FormBuilder,
				@Inject(DATA_PROVIDER) private readonly dataProvider: DataProvider) {
		this.activeProject$ = this.store.select(ProjectSelector.activeProject());

		this.abiInterfaces$ = this.store.select(ProjectSelector.activeProject()).pipe(
			map(project => (project?.abiInterfaces || []).filter(abi => abi.hasWasm)),
		);

		this.wallets$ = this.store.select(ProjectSelector.activeProject()).pipe(
			map(project => project?.wallets || []),
		);
	}

	ngOnInit(): void {
	}

	getTransaction(project: Project, wasm: string): Transaction | undefined {
		if (!this.form?.valid) {
			return;
		}

		const constructor = this.sc?.getAbi()?.getConstructorDefinition();
		if (!constructor) {
			return;
		}

		console.log('form_value', this.form.value)

		return this.sc.deploy({
			codeMetadata: this.scMetadata || '',
			code: Buffer.from(wasm, 'utf-8').toString('hex'),
			initArguments: ScArgsBuilder.buildFromEndpointDefinition(constructor, this.form.value || {}),
			chainID: project.chainId,
			gasLimit: 0,
		});
	}

	async estimateDeploy(project: Project, wasm: string): Promise<number> {
		const tx = this.getTransaction(project, wasm);

		if (!tx) {
			return 0;
		}

		const network = await this.store.select(NetworkSelector.networkByChainId(project.chainId)).pipe(
			take(1),
		).toPromise();

		if (!network) {
			return 0;
		}

		return this.txEstimator.estimate(tx, this.selectedWallet, network);
	}

	async selectWallet(wallet: ProjectWallet, project: Project): Promise<void> {
		console.log('select wallet', wallet)
		this.selectedWallet = wallet;

		return this.estimateGasLimit(project, this.selectedAbi);
	}

	 selectAbi(abi: ProjectAbi, project: Project): void {
		setTimeout(async () => {
			this.selectedAbi = abi;
			this.sc = ScBuilder.build('', this.selectedAbi.content);
			this.form = this.fb.group(
				(this.sc.getAbi()?.getConstructorDefinition()?.input || [])
					.map(i => ({[i.name]: new FormControl('')}))
					.reduce((p, c) => ({...p, ...c}), {}),
			);

			this.form.valueChanges.subscribe( (value) => {
				console.log('value', value);
				setTimeout(() => this.estimateGasLimit(project, abi))
			});

			await this.estimateGasLimit(project, abi);
		}, 0);
	}

	async estimateGasLimit(project: Project, abi: ProjectAbi): Promise<void> {
		console.log('estimateGasLimit');
		if (this.selectedWallet && abi) {
			console.log('pass')
			this.wasmCode = await this.dataProvider.getWasm(project.id, abi.id).toPromise();

			console.log('wasmCode:', this.wasmCode);

			// this.wasmCode = await this.store.select(NetworkSelector.)

			this.gasLimit = await this.estimateDeploy(project, this.wasmCode);
		}
	};

	deploy(project: Project): void {
		// console.log('args', this.form?.value);
		if (!this.wasmCode || !this.selectedWallet) {
			return;
		}

		const tx = this.getTransaction(project, this.wasmCode);

		if (!tx) {
			return;
		}

		tx.setGasLimit(this.gasLimit);

		this.txSender.send(project.id, this.selectedWallet, tx).pipe(
			map(txHash => {
				const log: ActionHistoryElement = {
					id: uuid.v4(),
					txHash,
					projectId: project.id,
					type: ActionType.Issue,
					data: this.form?.value,
					chainId: project.chainId,
					title: `Deploy ${this.selectedAbi.name} SC`,
					status: ActionStatus.Pending,
					caller: this.selectedWallet.address,
					timestamp: Date.now(),
				};

				this.store.dispatch(ActionHistoryAction.logAction({ data :log }));
			}),
		).subscribe(() => console.log('ok'));
	}
}
