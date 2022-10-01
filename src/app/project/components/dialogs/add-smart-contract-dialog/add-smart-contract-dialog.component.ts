import { Component, OnInit } from '@angular/core';
import { AbstractModalDialog } from '../../../../core/ui/dialog/abstract-modal-dialog';
import { DialogRef } from '../../../../core/ui/dialog/dialog-ref';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ProjectSelector } from '../../../store/project.selector';
import { Project, ProjectAbi } from '../../../../core/data-provider/data-provider';
import { map, switchMap } from 'rxjs/operators';
import { INetworkEnvironment } from '../../../../core/elrond/interfaces/network-environment';
import { NetworkSelector } from '../../../../network/store/network.selector';

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

	project$?: Observable<Project | undefined>;

	constructor(private readonly store: Store) {
		super();
	}

	ngOnInit(): void {
		this.abiInterfaces$ = this.store.select(ProjectSelector.projectById(this.dialogRef.data.projectId)).pipe(
			map(project => project?.abiInterfaces || []),
		);
		this.project$ = this.store.select(ProjectSelector.projectById(this.dialogRef.data.projectId));

		this.dialogRef.options.width = '560px';
		this.dialogRef.options.height = '260px';
	}

	create(): void {
		this.dialogRef.submit({name: this.projectName, abiId: this.abiId, address: this.address});
	}

	onChangeAbiId(abiId: string): void {
		this.abiId = abiId;
	}
}

