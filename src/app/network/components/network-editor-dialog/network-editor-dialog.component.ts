import { Component, OnInit } from '@angular/core';
import { AbstractModalDialog } from '../../../core/ui/dialog/abstract-modal-dialog';
import { DialogRef } from '../../../core/ui/dialog/dialog-ref';
import { INetworkEnvironment } from '../../../core/elrond/interfaces/network-environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-network-editor-dialog',
	templateUrl: './network-editor-dialog.component.html',
	styleUrls: ['./network-editor-dialog.component.scss']
})
export class NetworkEditorDialogComponent extends AbstractModalDialog implements OnInit {
	get title(): string {
		return this.dialogRef.data ? 'Update network' : 'Create network';
	}

	get action(): string {
		return this.dialogRef.data ? 'Update' : 'Create';
	}

	dialogRef!: DialogRef<INetworkEnvironment | undefined, {chainId: string, network: INetworkEnvironment}>;

	form!: FormGroup;

	constructor(private readonly fb: FormBuilder) {
		super();
	}

	ngOnInit(): void {
		const network = this.dialogRef.data;

		this.form = this.fb.group({
			name: [network?.name, Validators.required],
			chainId: [network?.chainId, Validators.required],
			gatewayUrl: [network?.gatewayUrl, Validators.required],
			explorerUrl: [network?.explorerUrl, Validators.required],
		});

		this.dialogRef.options.width = '300px';
		this.dialogRef.options.height = '340px';
	}

	submit(): void {
		this.dialogRef.submit({
			network: this.form.value,
			chainId: this.dialogRef.data?.chainId || this.form.value.chainId,
		});
	}
}
