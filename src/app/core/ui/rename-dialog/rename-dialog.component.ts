import { Component, OnInit } from '@angular/core';
import { AbstractModalDialog } from '../dialog/abstract-modal-dialog';
import { DialogRef } from '../dialog/dialog-ref';

@Component({
	selector: 'app-rename-dialog',
	templateUrl: './rename-dialog.component.html',
	styleUrls: ['./rename-dialog.component.scss']
})
export class RenameDialogComponent extends AbstractModalDialog implements OnInit {
	name = '';

	dialogRef!: DialogRef<{title: string}, { name: string }>;

	constructor() {
		super();
	}

	ngOnInit(): void {
		this.dialogRef.options.width = '300px';
		this.dialogRef.options.height = '180px';
	}

	create(): void {
		this.dialogRef.submit({name: this.name});
	}
}
