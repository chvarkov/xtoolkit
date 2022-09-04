import { Component, Input, OnInit } from '@angular/core';
import { IElrondTransaction } from '../../interfaces/elrond-transaction';

@Component({
	selector: 'app-transaction',
	templateUrl: './transaction.component.html',
	styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
	@Input() tx?: IElrondTransaction;

	constructor() {
	}

	ngOnInit(): void {
	}

}
