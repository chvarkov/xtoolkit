import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectWallet } from '../../../../../core/data-provider/data-provider';

@Component({
	selector: 'app-sc-endpoint-query',
	templateUrl: './sc-endpoint-query.component.html',
	styleUrls: ['./sc-endpoint-query.component.scss']
})
export class ScEndpointQueryComponent implements OnInit {
	@Input() wallets: ProjectWallet[] = [];

	@Output() onSubmit = new EventEmitter<{wallet?: ProjectWallet}>();

	wallet?: ProjectWallet;

	constructor() {
	}

	ngOnInit(): void {
	}

	submit(): void {
		this.onSubmit.emit({wallet: this.wallet});
	}
}
