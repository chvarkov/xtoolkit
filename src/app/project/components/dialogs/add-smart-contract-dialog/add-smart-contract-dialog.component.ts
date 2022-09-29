import { Component, OnInit } from '@angular/core';
import { AbstractModalDialog } from '../../../../core/ui/dialog/abstract-modal-dialog';
import { DialogRef } from '../../../../core/ui/dialog/dialog-ref';
import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../../../../core/elrond/interfaces/network-environment';
import { Store } from '@ngrx/store';
import { NetworkSelector } from '../../../../network/store/network.selector';
import { ProjectSelector } from '../../../store/project.selector';
import { ProjectAbi } from '../../../../core/data-provider/data-provider';
import { map } from 'rxjs/operators';

@Component({
	selector: 'app-add-smart-contract-dialog',
	templateUrl: './add-smart-contract-dialog.component.html',
	styleUrls: ['./add-smart-contract-dialog.component.scss']
})
export class AddSmartContractDialogComponent  extends AbstractModalDialog implements OnInit {
	projectName = '';

	abiId = '';

	address = '';

	dialogRef!: DialogRef<{ projectId: string }, { name: string, address: string, abiId: string }>;

	abiInterfaces$?: Observable<ProjectAbi[]>;

	constructor(private readonly store: Store) {
		super();
	}

	ngOnInit(): void {
		this.abiInterfaces$ = this.store.select(ProjectSelector.projectById(this.dialogRef.data.projectId)).pipe(
			map(project => project?.abiInterfaces || []),
		);

		this.dialogRef.options.width = '300px';
		this.dialogRef.options.height = '220px';
	}

	create(): void {
		this.dialogRef.submit({name: this.projectName, abiId: this.abiId, address: this.address});
	}

	onChangeAbiId(abiId: string): void {
		this.abiId = abiId;
	}
}

