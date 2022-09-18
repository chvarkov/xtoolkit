import { Component, Input, OnInit } from '@angular/core';
import { ActionStatus } from '../../../core/data-provider/data-provider';

@Component({
	selector: 'app-action-status-badge',
	templateUrl: './action-status-badge.component.html',
	styleUrls: ['./action-status-badge.component.scss']
})
export class ActionStatusBadgeComponent implements OnInit {
	@Input() status?: ActionStatus;

	constructor() {
	}

	ngOnInit(): void {
	}

}
