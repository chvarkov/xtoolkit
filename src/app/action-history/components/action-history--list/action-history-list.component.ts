import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IElrondTransaction } from '../../../core/elrond/interfaces/elrond-transaction';
import { ActionHistorySelector } from '../../store/action-history.selector';
import { ActionHistoryAction } from '../../store/action-history.action';

@Component({
	selector: 'app-action-list',
	templateUrl: './action-history-list.component.html',
	styleUrls: ['./action-history-list.component.scss']
})
export class ActionHistoryListComponent implements OnInit {
	address = 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqplllst77y4l';

	transactions$: Observable<IElrondTransaction[]>;

	constructor(private readonly store: Store) {
		this.transactions$ = this.store.select(ActionHistorySelector.transactionsByAddress(this.address));
	}

	ngOnInit(): void {
		this.store.dispatch(ActionHistoryAction.loadTransactions({address: this.address}));

	}
}
