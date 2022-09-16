import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IGeneratedWallet } from '../../../../../project/components/dialogs/generate-wallet-dialog/generate-wallet-dialog.component';
import { SelectElement } from '../../../../../core/ui/select/select.component';

@Component({
	selector: 'app-sc-endpoint-query',
	templateUrl: './sc-endpoint-query.component.html',
	styleUrls: ['./sc-endpoint-query.component.scss']
})
export class ScEndpointQueryComponent implements OnInit {
	@Input() wallets: IGeneratedWallet[] = [];

	@Output() onSubmit = new EventEmitter<{wallet?: IGeneratedWallet}>();

	wallet?: IGeneratedWallet;

	constructor() {
	}

	ngOnInit(): void {
	}

	onSelectedWallet(event: SelectElement<IGeneratedWallet | null>): void {
		this.wallet = event.value || undefined;
	}

	submit(): void {
		this.onSubmit.emit({wallet: this.wallet});
	}
}
