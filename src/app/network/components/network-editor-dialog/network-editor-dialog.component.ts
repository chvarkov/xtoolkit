import { Component, Inject, OnInit } from '@angular/core';
import { INetworkEnvironment } from '../../../core/elrond/interfaces/network-environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DEFAULT_WALLET_CONNECT_BRIDGE_URL, DEFAULT_WALLET_CONNECT_DEEP_LINK } from '../../../core/constants';

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
			apiUrl: [this.data?.apiUrl, Validators.required],
			explorerUrl: [this.data?.explorerUrl, Validators.required],
			egldLabel: [this.data?.egldLabel || 'EGLD', Validators.required],
			gasPerDataByte: [this.data?.gasPerDataByte || 1_500, Validators.required],
			egldDenomination: [this.data?.egldDenomination || 18, Validators.required],
			walletConnectDeepLink: [this.data?.walletConnectDeepLink || DEFAULT_WALLET_CONNECT_DEEP_LINK, Validators.required],
			walletConnectBridgeAddress: [this.data?.walletConnectBridgeAddresses?.[0] || DEFAULT_WALLET_CONNECT_BRIDGE_URL, Validators.required],
		});
	}

	submit(): void {
		if (this.form.invalid) {
			return;
		}

		const value = this.form.value;

		const network: INetworkEnvironment = {
			name: value.name,
			chainId: value.chainId,
			apiUrl: value.apiUrl,
			explorerUrl: value.explorerUrl,
			egldLabel: value.egldLabel,
			gasPerDataByte: value.gasPerDataByte,
			egldDenomination: value.egldDenomination,
			walletConnectDeepLink: value.walletConnectDeepLink,
			walletConnectBridgeAddresses: [value.walletConnectBridgeAddress],
		};

		this.dialogRef.close(network);
	}
}
