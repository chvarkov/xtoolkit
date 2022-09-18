import { Component, Input, OnInit } from '@angular/core';
import { TransactionStatus } from '../../../../../action-history/enums/transaction-status';

@Component({
	selector: 'app-account-transaction-status-badge',
	templateUrl: './account-transaction-status-badge.component.html',
	styleUrls: ['./account-transaction-status-badge.component.scss']
})
export class AcccountTransactionStatusBadgeComponent implements OnInit {
	@Input() status?: TransactionStatus;

	constructor() {
	}

	ngOnInit(): void {
	}

}
