import { Component, OnInit } from '@angular/core';
import { AbstractModalDialog } from '../../../../core/ui/dialog/abstract-modal-dialog';
import { DialogRef } from '../../../../core/ui/dialog/dialog-ref';

@Component({
	selector: 'app-create-project-dialog',
	templateUrl: './create-project-dialog.component.html',
	styleUrls: ['./create-project-dialog.component.scss']
})
export class CreateProjectDialogComponent extends AbstractModalDialog implements OnInit {
	projectName = '';

	dialogRef!: DialogRef<void, string>;

	constructor() {
		super();
	}

	ngOnInit(): void {
		this.dialogRef.options.width = '300px';
		this.dialogRef.options.height = '160px';
	}
}
