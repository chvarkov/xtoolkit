import { Component, Input, OnInit } from '@angular/core';
import { ITransactionPreview } from '../../interfaces/transaction-preview';

@Component({
	selector: 'app-transaction',
	templateUrl: './transaction.component.html',
	styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
	@Input() preview?: ITransactionPreview;

	constructor() {
	}

	ngOnInit(): void {
	}

}
