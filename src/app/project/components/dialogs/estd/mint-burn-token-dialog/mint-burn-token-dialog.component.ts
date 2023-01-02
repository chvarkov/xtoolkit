import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectWallet, Project } from '../../../../../core/data-provider/data-provider';
import { ProjectSelector } from '../../../../store/project.selector';
import { switchMap } from 'rxjs/operators';
import { NetworkSelector } from '../../../../../network/store/network.selector';
import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../../../../../core/elrond/interfaces/network-environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ESDTInteractor } from '../../../../../core/elrond/services/estd-intercator';

@Component({
	selector: 'app-mint-token-dialog',
	templateUrl: './mint-burn-token-dialog.component.html',
	styleUrls: ['./mint-burn-token-dialog.component.scss']
})
export class MintBurnTokenDialogComponent implements OnInit {
	wallet?: ProjectWallet;

	network$?: Observable<INetworkEnvironment | undefined>;

	project$?: Observable<Project | undefined>;

	mintTokenForm!: FormGroup;

	get actionName(): string {
		return this.data.isMint ? 'Mint' : 'Burn';
	}

	get title(): string {
		return this.data.isMint ? 'Mint token' : 'Burn token';
	}

	constructor(@Inject(MAT_DIALOG_DATA) private readonly data: {projectId: string, identifier: string, isMint: boolean},
				readonly dialogRef: MatDialogRef<MintBurnTokenDialogComponent>,
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

	submit(network: INetworkEnvironment): void {
		if (!this.mintTokenForm.valid) {
			return;
		}

		if (!this.wallet) {
			return;
		}

		this.dialogRef.close([
			this.data.projectId,
			network,
			this.wallet,
			{
				...this.mintTokenForm.getRawValue(),
				mintedTokensOwner: this.wallet.address,
			},
		]);
	}

	onChangeIssuerWallet(wallet: ProjectWallet): void {
		this.wallet = wallet;
	}
}
