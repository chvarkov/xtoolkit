import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-rename-dialog',
	templateUrl: './rename-dialog.component.html',
	styleUrls: ['./rename-dialog.component.scss']
})
export class RenameDialogComponent implements OnInit {
	name = '';

	constructor(@Inject(MAT_DIALOG_DATA) readonly data: {title: string},
				readonly dialogRef: MatDialogRef<RenameDialogComponent>) {
	}

	ngOnInit(): void {
	}

	create(): void {
		this.dialogRef.close({name: this.name});
	}
}
