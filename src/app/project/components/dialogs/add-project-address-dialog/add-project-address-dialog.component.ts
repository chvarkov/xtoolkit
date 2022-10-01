import { Component, OnInit } from '@angular/core';
import { AbstractModalDialog } from '../../../../core/ui/dialog/abstract-modal-dialog';
import { DialogRef } from '../../../../core/ui/dialog/dialog-ref';
import { Observable } from 'rxjs';
import { Project, ProjectAbi, ProjectAddress } from '../../../../core/data-provider/data-provider';
import { Store } from '@ngrx/store';
import { ProjectSelector } from '../../../store/project.selector';
import { map } from 'rxjs/operators';

@Component({
	selector: 'app-add-project-address-dialog',
	templateUrl: './add-project-address-dialog.component.html',
	styleUrls: ['./add-project-address-dialog.component.scss']
})
export class AddProjectAddressDialogComponent extends AbstractModalDialog implements OnInit {
	name = '';

	address = '';

	dialogRef!: DialogRef<{ projectId: string }, ProjectAddress>;

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
		const address: ProjectAddress = {
			address: this.address,
			name: this.name,
			projectId: this.dialogRef.data.projectId,
			type: 'wallet',
			savedAt: Date.now(),
		};

		console.log('create', address);
		this.dialogRef.submit(address);
	}
}
