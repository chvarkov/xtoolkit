import { Component, OnInit } from '@angular/core';
import { DialogRef } from '../../../../core/ui/dialog/dialog-ref';
import { Mnemonic } from '@elrondnetwork/erdjs-walletcore/out';
import { AbstractModalDialog } from '../../../../core/ui/dialog/abstract-modal-dialog';
import { GeneratedWallet } from '../../../../core/data-provider/data-provider';

@Component({
	selector: 'app-generate-wallet-dialog',
	templateUrl: './generate-wallet-dialog.component.html',
	styleUrls: ['./generate-wallet-dialog.component.scss']
})
export class GenerateWalletDialogComponent extends AbstractModalDialog implements OnInit {
	walletName = '';

	dialogRef!: DialogRef<void, GeneratedWallet>;

	constructor() {
		super();
	}

	ngOnInit(): void {
		this.dialogRef.options.width = '300px';
		this.dialogRef.options.height = '160px';
	}

	generate(): void {
		const mnemonic = Mnemonic.generate();
		const address = mnemonic.deriveKey().generatePublicKey().toAddress()

		this.dialogRef.submit({
			name: this.walletName,
			address: address.bech32(),
			mnemonic: mnemonic.getWords(),
		});
	}
}
