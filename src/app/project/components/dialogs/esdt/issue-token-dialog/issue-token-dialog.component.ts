import { Component, Inject, OnInit } from '@angular/core';
import { ProjectWallet, Project } from '../../../../../core/data-provider/data-provider';
import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../../../../../core/elrond/interfaces/network-environment';
import { ITokenInfo } from '../../../../../core/elrond/interfaces/token-info';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ESDTInteractor } from '../../../../../core/elrond/services/esdt-intercator';
import { ProjectSelector } from '../../../../store/project.selector';
import { switchMap } from 'rxjs/operators';
import { NetworkSelector } from '../../../../../network/store/network.selector';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-issue-token-dialog',
	templateUrl: './issue-token-dialog.component.html',
	styleUrls: ['./issue-token-dialog.component.scss']
})
export class IssueTokenDialogComponent implements OnInit {
	wallet!: ProjectWallet;

	project$?: Observable<Project | undefined>;

	network$?: Observable<INetworkEnvironment | undefined>;

	tokens$!: Observable<ITokenInfo[]>;

	form!: FormGroup;

	constructor(@Inject(MAT_DIALOG_DATA) private readonly data: {projectId: string},
				readonly dialogRef: MatDialogRef<IssueTokenDialogComponent>,
				private readonly store: Store,
				private readonly esdtInteractor: ESDTInteractor,
				private readonly fb: FormBuilder) {
	}

	ngOnInit(): void {
		this.project$ = this.store.select(ProjectSelector.activeProject());
		this.network$ = this.project$.pipe(
			switchMap((project) => this.store.select(NetworkSelector.networkByChainId(project?.chainId || ''))),
		);
		this.tokens$ = this.store.select(ProjectSelector.tokens());

		this.form = this.fb.group({
			name: ['', Validators.required],
			ticker: ['', Validators.required],
			supply: [0, Validators.required],
			decimals: [0, Validators.required],
			canFreeze: [false],
			canWipe: [false],
			canPause: [false],
			canMint: [false],
			canBurn: [false],
			canChangeOwner: [false],
			canUpgrade: [false],
			canAddSpecialRoles: [false],
		});
	}

	getControl(name: string): AbstractControl {
		return this.form.get(name)!;
	}

	isControlHasError(name: string): boolean {
		const control = this.getControl(name);

		return control.invalid && (control.dirty || control.touched);
	}

	onChangeIssuerWallet(wallet: ProjectWallet): void {
		this.wallet = wallet;
	}

	async submit(network: INetworkEnvironment): Promise<void> {
		if (!this.form.valid) {
			return;
		}

		if (!this.wallet) {
			return;
		}

		this.dialogRef.close([
			this.data.projectId,
			network,
			this.wallet,
			this.form.value
		]);
	}
}
