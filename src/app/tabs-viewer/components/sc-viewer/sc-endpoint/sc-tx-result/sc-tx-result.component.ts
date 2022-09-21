import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-sc-tx-result',
	templateUrl: './sc-tx-result.component.html',
	styleUrls: ['./sc-tx-result.component.scss']
})
export class ScTxResultComponent implements OnInit {
	@Input() chainId: string = '';
	@Input() txHash: string = '';

	constructor() {
	}

	ngOnInit(): void {
	}

}
