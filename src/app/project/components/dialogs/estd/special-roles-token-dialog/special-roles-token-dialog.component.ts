import { Component, Inject, OnInit } from '@angular/core';
import { ProjectWallet, Project } from '../../../../../core/data-provider/data-provider';
import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../../../../../core/elrond/interfaces/network-environment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ESDTInteractor } from '../../../../../core/elrond/services/estd-intercator';
import { Store } from '@ngrx/store';
import { ProjectSelector } from '../../../../store/project.selector';
import { switchMap } from 'rxjs/operators';
import { NetworkSelector } from '../../../../../network/store/network.selector';

@Component({
	selector: 'app-special-roles-token-dialog',
	templateUrl: './special-roles-token-dialog.component.html',
	styleUrls: ['./special-roles-token-dialog.component.scss']
})
export class SpecialRolesTokenDialogComponent implements OnInit {
	wallet?: ProjectWallet;

	network$?: Observable<INetworkEnvironment | undefined>;

	project$?: Observable<Project | undefined>;

	address = '';

	form!: FormGroup;

	get disabled(): boolean {
		return !this.address || (!this.form.value.ESDTRoleLocalBurn && !this.form.value.ESDTRoleLocalMint)
	}

	constructor(@Inject(MAT_DIALOG_DATA) private readonly data: {projectId: string, identifier: string},
				readonly dialogRef: MatDialogRef<SpecialRolesTokenDialogComponent>,
				private readonly estdInteractor: ESDTInteractor,
				private readonly fb: FormBuilder,
				private readonly store: Store) {
		this.project$ = this.store.select(ProjectSelector.activeProject());
		this.network$ = this.project$.pipe(
			switchMap((project) => this.store.select(NetworkSelector.networkByChainId(project?.chainId || ''))),
		);

		this.form = this.fb.group({
			identifier: {
				value: this.data.identifier,
				disabled: true,
			},
			ESDTRoleLocalBurn: [false],
			ESDTRoleLocalMint: [false],
		});
	}

	ngOnInit(): void {
	}

	submit(network: INetworkEnvironment): void {
		if (!this.wallet) {
			return;
		}

		this.dialogRef.close([
			this.data.projectId,
			network,
			this.wallet,
			{
				...this.form.getRawValue(),
				address: this.address,
			},
		]);
	}

	onChangeAddress(address: string): void {
		this.address = address;
	}

	onChangeSignerWallet(wallet: ProjectWallet): void {
		this.wallet = wallet;
	}
}
