import { Component, Inject, OnInit } from '@angular/core';
import {
	ActionStatus,
	ActionType,
	GeneratedWallet,
	Project
} from '../../../../core/data-provider/data-provider';
import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../../../../core/elrond/interfaces/network-environment';
import { ITokenInfo } from '../../../../core/elrond/interfaces/token-info';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ESDTInteractor } from '../../../../core/elrond/services/estd-intercator';
import { ProjectSelector } from '../../../store/project.selector';
import { switchMap } from 'rxjs/operators';
import { NetworkSelector } from '../../../../network/store/network.selector';
import * as uuid from 'uuid';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-issue-token-dialog',
	templateUrl: './issue-token-dialog.component.html',
	styleUrls: ['./issue-token-dialog.component.scss']
})
export class IssueTokenDialogComponent implements OnInit {
	wallet!: GeneratedWallet;

	project$?: Observable<Project | undefined>;

	network$?: Observable<INetworkEnvironment | undefined>;

	tokens$!: Observable<ITokenInfo[]>;

	issueTokenForm!: FormGroup;

	constructor(@Inject(MAT_DIALOG_DATA) private readonly data: {projectId: string},
				readonly dialogRef: MatDialogRef<IssueTokenDialogComponent>,
				private readonly store: Store,
				private readonly estdInteractor: ESDTInteractor,
				private readonly fb: FormBuilder) {
	}

	ngOnInit(): void {
		this.project$ = this.store.select(ProjectSelector.projectById(this.data.projectId));
		this.network$ = this.project$.pipe(
			switchMap((project) => this.store.select(NetworkSelector.networkByChainId(project?.chainId || ''))),
		);
		this.tokens$ = this.store.select(ProjectSelector.tokens(this.data.projectId));

		this.issueTokenForm = this.fb.group({
			name: ['', Validators.required],
			ticker: ['', Validators.required],
			supply: [0, Validators.required],
			decimals: [0, Validators.required],
		});
	}

	onChangeIssuerWallet(wallet: GeneratedWallet): void {
		this.wallet = wallet;
	}

	async submit(network: INetworkEnvironment, wallet: GeneratedWallet): Promise<void> {
		if (!this.issueTokenForm.valid) {
			return;
		}

		if (!this.wallet) {
			return;
		}

		const txHash = await this.estdInteractor.issueFungibleToken(network, wallet, this.issueTokenForm.value);

		this.dialogRef.close({
			id: uuid.v4(),
			txHash,
			projectId: this.data.projectId,
			type: ActionType.Issue,
			data: this.issueTokenForm.value,
			chainId: network.chainId,
			title: 'Issue token',
			status: ActionStatus.Pending,
			caller: wallet.address,
			timestamp: Date.now(),
		});
	}
}
