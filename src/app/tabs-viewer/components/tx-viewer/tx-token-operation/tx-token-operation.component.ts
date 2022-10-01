import { Component, Input, OnInit } from '@angular/core';
import { ITxOperation } from '../../../../core/elrond/interfaces/elrond-transaction';

@Component({
	selector: 'app-tx-token-operation',
	templateUrl: './tx-token-operation.component.html',
	styleUrls: ['./tx-token-operation.component.scss']
})
export class TxTokenOperationComponent implements OnInit {
	@Input() operation?: ITxOperation;
	@Input() chainId: string = '';
	@Input() index?: number;

	constructor() {
	}

	ngOnInit(): void {
	}

}
