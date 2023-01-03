import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-set-maiar-wallet-name-dialog',
	templateUrl: './set-maiar-wallet-name-dialog.component.html',
	styleUrls: ['./set-maiar-wallet-name-dialog.component.scss']
})
export class SetMaiarWalletNameDialogComponent implements OnInit {
	name = '';

	constructor(readonly dialogRef: MatDialogRef<SetMaiarWalletNameDialogComponent>) {
	}

	ngOnInit(): void {
	}

	setName(): void {
		this.dialogRef.close(this.name);
	}
}
