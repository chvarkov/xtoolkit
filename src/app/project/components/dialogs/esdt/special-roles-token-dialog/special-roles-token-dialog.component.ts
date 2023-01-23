import { Component, Inject, OnInit } from '@angular/core';
import { ProjectWallet, Project } from '../../../../../core/data-provider/data-provider';
import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../../../../../core/elrond/interfaces/network-environment';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ESDTInteractor } from '../../../../../core/elrond/services/esdt-intercator';
import { Store } from '@ngrx/store';
import { ProjectSelector } from '../../../../store/project.selector';
import { switchMap } from 'rxjs/operators';
import { NetworkSelector } from '../../../../../network/store/network.selector';
import { addressValidator } from '../../../../../core/validators/address-validator';

@Component({
	selector: 'app-special-roles-token-dialog',
	templateUrl: './special-roles-token-dialog.component.html',
	styleUrls: ['./special-roles-token-dialog.component.scss']
})
export class SpecialRolesTokenDialogComponent implements OnInit {
	wallet?: ProjectWallet;

	network$?: Observable<INetworkEnvironment | undefined>;

	project$?: Observable<Project | undefined>;

	form!: FormGroup;

	constructor(@Inject(MAT_DIALOG_DATA) private readonly data: {projectId: string, identifier: string},
				readonly dialogRef: MatDialogRef<SpecialRolesTokenDialogComponent>,
				private readonly esdtInteractor: ESDTInteractor,
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
			address: ['', [Validators.required, addressValidator]],
			ESDTRoleLocalBurn: [false],
			ESDTRoleLocalMint: [false],
		});
	}

	ngOnInit(): void {
	}

	getControl(name: string): AbstractControl {
		return this.form.get(name)!;
	}

	isControlHasError(name: string): boolean {
		const control = this.getControl(name);

		return control.invalid && (control.dirty || control.touched);
	}

	submit(network: INetworkEnvironment): void {
		if (!this.wallet || this.form.invalid) {
			return;
		}

		this.dialogRef.close([
			this.data.projectId,
			network,
			this.wallet,
			this.form.getRawValue(),
		]);
	}

	onChangeSignerWallet(wallet: ProjectWallet): void {
		this.wallet = wallet;
	}
}
