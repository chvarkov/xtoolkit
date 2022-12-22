import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ProjectSelector } from '../../../store/project.selector';
import { Project, ProjectAbi } from '../../../../core/data-provider/data-provider';
import { map } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-add-smart-contract-dialog',
	templateUrl: './add-smart-contract-dialog.component.html',
	styleUrls: ['./add-smart-contract-dialog.component.scss']
})
export class AddSmartContractDialogComponent implements OnInit {
	projectName = '';

	abiId = '';

	address = '';

	abiInterfaces$?: Observable<ProjectAbi[]>;

	project$?: Observable<Project | undefined>;

	constructor(@Inject(MAT_DIALOG_DATA) private readonly data: { projectId: string },
				readonly dialogRef: MatDialogRef<AddSmartContractDialogComponent>,
				private readonly store: Store) {
	}

	ngOnInit(): void {
		this.abiInterfaces$ = this.store.select(ProjectSelector.activeProject()).pipe(
			map(project => project?.abiInterfaces || []),
		);
		this.project$ = this.store.select(ProjectSelector.activeProject());
	}

	create(): void {
		this.dialogRef.close({name: this.projectName, abiId: this.abiId, address: this.address});
	}

	onChangeAbiId(abiId: string): void {
		this.abiId = abiId;
	}
}

