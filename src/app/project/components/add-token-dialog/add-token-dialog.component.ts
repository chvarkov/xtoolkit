import { Component, OnInit } from '@angular/core';
import { AbstractModalDialog } from '../../../core/ui/dialog/abstract-modal-dialog';
import { DialogRef } from '../../../core/ui/dialog/dialog-ref';

@Component({
	selector: 'app-add-token-dialog',
	templateUrl: './add-token-dialog.component.html',
	styleUrls: ['./add-token-dialog.component.scss']
})
export class AddTokenDialogComponent extends AbstractModalDialog implements OnInit {
	tokenId = '';

	dialogRef!: DialogRef<void, string>;

	constructor() {
		super();
	}

	ngOnInit(): void {
		this.dialogRef.options.width = '300px';
		this.dialogRef.options.height = '160px';
	}

	submit(): void {
		this.dialogRef.submit(this.tokenId);
	}
}
