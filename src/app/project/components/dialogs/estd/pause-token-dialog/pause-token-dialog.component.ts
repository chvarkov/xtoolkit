import { Component, Inject, OnInit } from '@angular/core';
import { ProjectWallet, Project } from '../../../../../core/data-provider/data-provider';
import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../../../../../core/elrond/interfaces/network-environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ESDTInteractor } from '../../../../../core/elrond/services/estd-intercator';
import { Store } from '@ngrx/store';
import { ProjectSelector } from '../../../../store/project.selector';
import { switchMap } from 'rxjs/operators';
import { NetworkSelector } from '../../../../../network/store/network.selector';

@Component({
	selector: 'app-pause-token-dialog',
	templateUrl: './pause-token-dialog.component.html',
	styleUrls: ['./pause-token-dialog.component.scss']
})
export class PauseTokenDialogComponent implements OnInit {
	wallet?: ProjectWallet;

	network$?: Observable<INetworkEnvironment | undefined>;

	project$?: Observable<Project | undefined>;

	form!: FormGroup;

	get actionName() {
		return this.data.isPause ? 'Pause' : 'Unpause';
	}

	get title() {
		return this.data.isPause ? 'Pause token' : 'Unpause token';
	}

	constructor(@Inject(MAT_DIALOG_DATA) private readonly data: {projectId: string, identifier: string, isPause: boolean},
				readonly dialogRef: MatDialogRef<PauseTokenDialogComponent>,
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
			},
		]);
	}

	onChangeSignerWallet(wallet: ProjectWallet): void {
		this.wallet = wallet;
	}
}
