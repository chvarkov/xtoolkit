import { Component, Input, OnInit } from '@angular/core';
import { IElrondTransaction } from '../../../../core/elrond/interfaces/elrond-transaction';

@Component({
	selector: 'app-account-transaction',
	templateUrl: './account-transaction.component.html',
	styleUrls: ['./account-transaction.component.scss']
})
export class AccountTransactionComponent implements OnInit {
	@Input() tx?: IElrondTransaction;

	@Input() chainId: string = '';

	constructor() {
	}

	ngOnInit(): void {
	}

}
