import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Project, ProjectAddress } from '../../../../core/data-provider/data-provider';
import { Store } from '@ngrx/store';
import { ProjectSelector } from '../../../store/project.selector';
import { ElrondDataProvider } from '../../../../core/elrond/elrond.data-provider';
import { INetworkEnvironment } from '../../../../core/elrond/interfaces/network-environment';
import { Address } from '@multiversx/sdk-core/out';
import { switchMap } from 'rxjs/operators';
import { NetworkSelector } from '../../../../network/store/network.selector';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addressValidator } from '../../../../core/validators/address-validator';

@Component({
	selector: 'app-add-project-address-dialog',
	templateUrl: './add-project-address-dialog.component.html',
	styleUrls: ['./add-project-address-dialog.component.scss']
})
export class AddProjectAddressDialogComponent implements OnInit {
	form: FormGroup;

	project$?: Observable<Project | undefined>;
	network$?: Observable<INetworkEnvironment | undefined>;

	constructor(@Inject(MAT_DIALOG_DATA) private readonly data: {projectId: string},
				readonly dialogRef: MatDialogRef<AddProjectAddressDialogComponent>,
				private readonly store: Store,
				private readonly fb: FormBuilder,
				private readonly elrondDataProvider: ElrondDataProvider) {
		this.form = this.fb.group({
			name: ['', Validators.required],
			address: ['', [
				Validators.required,
				addressValidator,
			]],
		});
	}

	ngOnInit(): void {
		this.project$ = this.store.select(ProjectSelector.activeProject());

		this.network$ = this.project$.pipe(
			switchMap((project) => this.store.select(NetworkSelector.networkByChainId(project?.chainId || ''))),
		);
	}

	getControl(name: string): AbstractControl {
		return this.form.get(name)!;
	}

	isControlHasError(name: string): boolean {
		const control = this.getControl(name);

		return control.invalid && (control.dirty || control.touched);
	}

	async create(network: INetworkEnvironment): Promise<void> {
		if (this.form.invalid) {
			return;
		}

		const address = this.form.value.address;
		const type = await this.elrondDataProvider.getProxy(network).getAccount(new Address(address))
			.then(acc => acc.code ? 'sc' : 'wallet');

		const addressObject: ProjectAddress = {
			address: this.form.value.address,
			name: this.form.value.name,
			projectId: this.data.projectId,
			type,
			savedAt: Date.now(),
		};

		this.dialogRef.close(addressObject);
	}
}
