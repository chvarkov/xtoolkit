import { Component, OnInit } from '@angular/core';
import { AbstractModalDialog } from '../../../../core/ui/dialog/abstract-modal-dialog';
import { DialogRef } from '../../../../core/ui/dialog/dialog-ref';
import { GeneratedWallet } from '../../../../core/data-provider/data-provider';

@Component({
	selector: 'app-export-mnemonic-dialog',
	templateUrl: './export-mnemonic-dialog.component.html',
	styleUrls: ['./export-mnemonic-dialog.component.scss']
})
export class ExportMnemonicDialogComponent extends AbstractModalDialog implements OnInit {
	dialogRef!: DialogRef<GeneratedWallet, void>;

	constructor() {
		super();
	}

	get mnemonic(): string {
		return this.dialogRef.data?.mnemonic?.join(' ');
	}

	ngOnInit(): void {
		this.dialogRef.options.width = '300px';
		this.dialogRef.options.height = '260px';
	}
}
