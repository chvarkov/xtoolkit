import { Component, Input, OnInit } from '@angular/core';
import { TransactionStatus } from '../../enums/transaction-status';

@Component({
	selector: 'app-action-status-badge',
	templateUrl: './action-status-badge.component.html',
	styleUrls: ['./action-status-badge.component.scss']
})
export class ActionStatusBadgeComponent implements OnInit {
	@Input() status?: TransactionStatus;

	constructor() {
	}

	ngOnInit(): void {
	}

}
