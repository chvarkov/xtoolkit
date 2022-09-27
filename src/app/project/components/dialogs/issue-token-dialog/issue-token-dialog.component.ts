import { Component, OnInit } from '@angular/core';
import { AbstractModalDialog } from '../../../../core/ui/dialog/abstract-modal-dialog';
import { DialogRef } from '../../../../core/ui/dialog/dialog-ref';
import {
	ActionHistoryElement,
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

@Component({
	selector: 'app-issue-token-dialog',
	templateUrl: './issue-token-dialog.component.html',
	styleUrls: ['./issue-token-dialog.component.scss']
})
export class IssueTokenDialogComponent extends AbstractModalDialog implements OnInit {
	wallet!: GeneratedWallet;

	project$?: Observable<Project | undefined>;

	network$?: Observable<INetworkEnvironment | undefined>;

	dialogRef!: DialogRef<{projectId: string}, ActionHistoryElement>;

	tokens$!: Observable<ITokenInfo[]>;

	issueTokenForm!: FormGroup;

	constructor(private readonly store: Store,
				private readonly estdInteractor: ESDTInteractor,
				private readonly fb: FormBuilder) {
		super();
	}

	ngOnInit(): void {
		this.dialogRef.options.width = '400px';
		this.dialogRef.options.height = '320px';
		this.project$ = this.store.select(ProjectSelector.projectById(this.dialogRef.data.projectId));
		this.network$ = this.project$.pipe(
			switchMap((project) => this.store.select(NetworkSelector.networkByChainId(project?.chainId || ''))),
		);
		this.tokens$ = this.store.select(ProjectSelector.tokens(this.dialogRef.data.projectId));

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

		this.dialogRef.submit({
			id: uuid.v4(),
			txHash,
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
