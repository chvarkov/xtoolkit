import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IGeneratedWallet } from '../../../../../project/components/dialogs/generate-wallet-dialog/generate-wallet-dialog.component';
import { SelectElement } from '../../../../../core/ui/select/select.component';

@Component({
	selector: 'app-sc-endpoint-tx-sign',
	templateUrl: './sc-endpoint-tx-sign.component.html',
	styleUrls: ['./sc-endpoint-tx-sign.component.scss']
})
export class ScEndpointTxSignComponent implements OnInit {
	@Input() wallets: IGeneratedWallet[] = [];

	@Output() onSubmit = new EventEmitter<{wallet: IGeneratedWallet, fee: number}>();

	wallet?: IGeneratedWallet;

	constructor() {
	}

	ngOnInit(): void {
	}

	onSelectedWallet(event: SelectElement<IGeneratedWallet>): void {
		this.wallet = event.value;
	}

	submit(fee: number): void {
		if (!this.wallet) {
			return;
		}

		this.onSubmit.emit({wallet: this.wallet, fee});
	}
}
