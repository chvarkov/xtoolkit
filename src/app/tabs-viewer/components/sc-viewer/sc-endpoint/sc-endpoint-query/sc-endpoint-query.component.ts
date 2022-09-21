import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectElement } from '../../../../../core/ui/select/select.component';
import { GeneratedWallet } from '../../../../../core/data-provider/data-provider';

@Component({
	selector: 'app-sc-endpoint-query',
	templateUrl: './sc-endpoint-query.component.html',
	styleUrls: ['./sc-endpoint-query.component.scss']
})
export class ScEndpointQueryComponent implements OnInit {
	@Input() wallets: GeneratedWallet[] = [];

	@Output() onSubmit = new EventEmitter<{wallet?: GeneratedWallet}>();

	wallet?: GeneratedWallet;

	constructor() {
	}

	ngOnInit(): void {
	}

	onSelectedWallet(event: SelectElement<GeneratedWallet | null>): void {
		this.wallet = event.value || undefined;
	}

	submit(): void {
		this.onSubmit.emit({wallet: this.wallet});
	}
}
