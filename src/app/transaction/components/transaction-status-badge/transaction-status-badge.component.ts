import { Component, Input, OnInit } from '@angular/core';
import { TransactionStatus } from '../../enums/transaction-status';

@Component({
	selector: 'app-transaction-status-badge',
	templateUrl: './transaction-status-badge.component.html',
	styleUrls: ['./transaction-status-badge.component.scss']
})
export class TransactionStatusBadgeComponent implements OnInit {
	@Input() status?: TransactionStatus;

	constructor() {
	}

	ngOnInit(): void {
	}

}
