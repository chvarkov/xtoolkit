import { Component, OnInit } from '@angular/core';
import { AbstractModalDialog } from '../dialog/abstract-modal-dialog';
import { DialogRef } from '../dialog/dialog-ref';

export interface ConfirmDialogData {
	title: string;
	message: string;
}

@Component({
	selector: 'app-confirm-dialog',
	templateUrl: './confirm-dialog.component.html',
	styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent extends AbstractModalDialog<ConfirmDialogData, void> implements OnInit {
	dialogRef!: DialogRef<ConfirmDialogData, void>;

	constructor() {
		super();
	}

	ngOnInit(): void {

	}

}
