import { Component, Input, OnInit } from '@angular/core';
import { ActionStatus } from '../../../core/data-provider/data-provider';

@Component({
	selector: 'app-action-status-badge',
	templateUrl: './action-status-icon.component.html',
	styleUrls: ['./action-status-icon.component.scss']
})
export class ActionStatusIconComponent implements OnInit {
	@Input() status?: ActionStatus;

	constructor() {
	}

	ngOnInit(): void {
	}

}
