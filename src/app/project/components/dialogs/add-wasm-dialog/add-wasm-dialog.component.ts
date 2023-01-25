import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-add-wasm-dialog',
	templateUrl: './add-wasm-dialog.component.html',
	styleUrls: ['./add-wasm-dialog.component.scss']
})
export class AddWasmDialogComponent implements OnInit {
	fileName = '';
	wasm = '';

	constructor(@Inject(MAT_DIALOG_DATA) private readonly data: {projectId: string, abiId: string},
				readonly dialogRef: MatDialogRef<AddWasmDialogComponent>) {
	}

	ngOnInit(): void {
	}

	async onFileSelected(event: any) {
		const file: File = event.target.files[0];

		if (file) {
			this.fileName = file.name;
			this.wasm = Buffer.from(await file.arrayBuffer()).toString('hex');
		}
	}

	submit(): void {
		this.dialogRef.close({
			projectId: this.data.projectId,
			abiId: this.data.abiId,
			wasm: this.wasm,
		});
	}
}
