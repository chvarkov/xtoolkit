import { Component, OnInit } from '@angular/core';
import { Mnemonic } from '@elrondnetwork/erdjs-walletcore/out';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-generate-wallet-dialog',
	templateUrl: './generate-wallet-dialog.component.html',
	styleUrls: ['./generate-wallet-dialog.component.scss']
})
export class GenerateWalletDialogComponent implements OnInit {
	walletName = '';

	constructor(readonly dialogRef: MatDialogRef<GenerateWalletDialogComponent>) {
	}

	ngOnInit(): void {
	}

	generate(): void {
		const mnemonic = Mnemonic.generate();
		const address = mnemonic.deriveKey().generatePublicKey().toAddress()

		this.dialogRef.close({
			name: this.walletName,
			address: address.bech32(),
			mnemonic: mnemonic.getWords(),
		});
	}
}
