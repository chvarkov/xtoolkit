import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Transaction } from '@multiversx/sdk-core/out';

@Component({
	selector: 'app-confirm-transaction-dialog',
	templateUrl: './confirm-transaction-dialog.component.html',
	styleUrls: ['./confirm-transaction-dialog.component.scss']
})
export class ConfirmTransactionDialogComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) readonly data: Transaction,
				readonly dialogRef: MatDialogRef<ConfirmTransactionDialogComponent>) {
	}

	ngOnInit(): void {
	}

	confirm(): void {
		this.dialogRef.close(true);
	}
}
