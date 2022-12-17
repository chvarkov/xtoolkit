import { Component, Inject, OnInit } from '@angular/core';
import { GeneratedWallet } from '../../../../core/data-provider/data-provider';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-export-mnemonic-dialog',
	templateUrl: './export-mnemonic-dialog.component.html',
	styleUrls: ['./export-mnemonic-dialog.component.scss']
})
export class ExportMnemonicDialogComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) readonly data: GeneratedWallet,
				readonly dialogRef: MatDialogRef<ExportMnemonicDialogComponent>) {
	}

	get mnemonic(): string {
		return this.data?.mnemonic?.join(' ');
	}

	ngOnInit(): void {
	}
}
