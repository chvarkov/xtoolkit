import { Component, Inject, OnInit } from '@angular/core';
import { INetworkEnvironment } from '../../../core/elrond/interfaces/network-environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-network-editor-dialog',
	templateUrl: './network-editor-dialog.component.html',
	styleUrls: ['./network-editor-dialog.component.scss']
})
export class NetworkEditorDialogComponent implements OnInit {
	get title(): string {
		return this.data ? 'Update network' : 'Create network';
	}

	get action(): string {
		return this.data ? 'Update' : 'Create';
	}

	form!: FormGroup;

	constructor(@Inject(MAT_DIALOG_DATA) private readonly data: INetworkEnvironment,
				readonly dialogRef: MatDialogRef<NetworkEditorDialogComponent>,
				private readonly fb: FormBuilder) {
	}

	ngOnInit(): void {
		this.form = this.fb.group({
			name: [this.data?.name, Validators.required],
			chainId: [this.data?.chainId, Validators.required],
			gatewayUrl: [this.data?.gatewayUrl, Validators.required],
			explorerUrl: [this.data?.explorerUrl, Validators.required],
		});
	}

	submit(): void {
		this.dialogRef.close({
			network: this.form.value,
			chainId: this.data?.chainId || this.form.value.chainId,
		});
	}
}
