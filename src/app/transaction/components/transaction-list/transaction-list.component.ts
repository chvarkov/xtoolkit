import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IElrondTransaction } from '../../../core/elrond/interfaces/elrond-transaction';
import { TransactionSelector } from '../../store/transaction.selector';
import { TransactionAction } from '../../store/transaction.action';

@Component({
	selector: 'app-transaction-list',
	templateUrl: './transaction-list.component.html',
	styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {
	address = 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqplllst77y4l';

	transactions$: Observable<IElrondTransaction[]>;

	constructor(private readonly store: Store) {
		this.transactions$ = this.store.select(TransactionSelector.transactionsByAddress(this.address));
	}

	ngOnInit(): void {
		this.store.dispatch(TransactionAction.loadTransactions({address: this.address}));

	}
}
