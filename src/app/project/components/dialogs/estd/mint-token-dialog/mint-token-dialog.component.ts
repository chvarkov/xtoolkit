import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActionStatus, ActionType, GeneratedWallet, Project } from '../../../../../core/data-provider/data-provider';
import { ProjectSelector } from '../../../../store/project.selector';
import { switchMap } from 'rxjs/operators';
import { NetworkSelector } from '../../../../../network/store/network.selector';
import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../../../../../core/elrond/interfaces/network-environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as uuid from 'uuid';
import { ESDTInteractor } from '../../../../../core/elrond/services/estd-intercator';

@Component({
	selector: 'app-mint-token-dialog',
	templateUrl: './mint-token-dialog.component.html',
	styleUrls: ['./mint-token-dialog.component.scss']
})
export class MintTokenDialogComponent implements OnInit {
	wallet?: GeneratedWallet;

	network$?: Observable<INetworkEnvironment | undefined>;

	project$?: Observable<Project | undefined>;

	mintTokenForm!: FormGroup;

	constructor(@Inject(MAT_DIALOG_DATA) private readonly data: {projectId: string, identifier: string},
				readonly dialogRef: MatDialogRef<MintTokenDialogComponent>,
				private readonly estdInteractor: ESDTInteractor,
				private readonly fb: FormBuilder,
				private readonly store: Store) {
		this.project$ = this.store.select(ProjectSelector.activeProject());
		this.network$ = this.project$.pipe(
			switchMap((project) => this.store.select(NetworkSelector.networkByChainId(project?.chainId || ''))),
		);

		this.mintTokenForm = this.fb.group({
			identifier: {
				value: this.data.identifier,
				disabled: true,
			},
			supply: [0, Validators.required],
		});
	}

	ngOnInit(): void {
	}

	async submit(network: INetworkEnvironment): Promise<void> {
		if (!this.mintTokenForm.valid) {
			return;
		}

		if (!this.wallet) {
			return;
		}

		const txHash = await this.estdInteractor.mint(network, this.wallet, {
			...this.mintTokenForm.getRawValue(),
			mintedTokensOwner: this.wallet.address,
		});

		this.dialogRef.close({
			id: uuid.v4(),
			txHash,
			projectId: this.data.projectId,
			type: ActionType.Issue,
			data: this.mintTokenForm.getRawValue(),
			chainId: network.chainId,
			title: `Mint token ${this.data.identifier}`,
			status: ActionStatus.Pending,
			caller: this.wallet.address,
			timestamp: Date.now(),
		});
	}

	onChangeIssuerWallet(wallet: GeneratedWallet): void {
		this.wallet = wallet;
	}
}
