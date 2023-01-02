import { Component, Inject, OnInit } from '@angular/core';
import { ProjectWallet, Project } from '../../../../../core/data-provider/data-provider';
import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../../../../../core/elrond/interfaces/network-environment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ProjectSelector } from '../../../../store/project.selector';
import { switchMap } from 'rxjs/operators';
import { NetworkSelector } from '../../../../../network/store/network.selector';

@Component({
	selector: 'app-transfer-ownership-dialog',
	templateUrl: './transfer-ownership-dialog.component.html',
	styleUrls: ['./transfer-ownership-dialog.component.scss']
})
export class TransferOwnershipDialogComponent implements OnInit {
	wallet?: ProjectWallet;

	network$?: Observable<INetworkEnvironment | undefined>;

	project$?: Observable<Project | undefined>;

	address = '';

	form!: FormGroup;

	constructor(@Inject(MAT_DIALOG_DATA) private readonly data: {projectId: string, identifier: string},
				readonly dialogRef: MatDialogRef<TransferOwnershipDialogComponent>,
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
				identifier: this.data.identifier,
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
