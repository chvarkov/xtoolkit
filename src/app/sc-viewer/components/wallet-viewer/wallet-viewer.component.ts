import { Component, Input, OnInit } from '@angular/core';
import { IGeneratedWallet } from '../../../project/components/dialogs/generate-wallet-dialog/generate-wallet-dialog.component';

@Component({
	selector: 'app-wallet-viewer',
	templateUrl: './wallet-viewer.component.html',
	styleUrls: ['./wallet-viewer.component.scss']
})
export class WalletViewerComponent implements OnInit {
	@Input() wallet?: IGeneratedWallet;

	constructor() {
	}

	ngOnInit(): void {
	}

}
