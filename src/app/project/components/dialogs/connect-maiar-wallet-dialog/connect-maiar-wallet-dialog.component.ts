import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-connect-maiar-wallet-dialog',
	templateUrl: './connect-maiar-wallet-dialog.component.html',
	styleUrls: ['./connect-maiar-wallet-dialog.component.scss']
})
export class ConnectMaiarWalletDialogComponent implements OnInit {

	constructor(@Inject(MAT_DIALOG_DATA) readonly connectUrl: string,
				readonly dialogRef: MatDialogRef<ConnectMaiarWalletDialogComponent>) {
	}

	ngOnInit(): void {
	}

}
