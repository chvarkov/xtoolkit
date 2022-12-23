import { Component, Input, OnInit } from '@angular/core';
import { ActionType } from '../../../core/data-provider/data-provider';

@Component({
	selector: 'app-action-type-icon',
	templateUrl: './action-type-icon.component.html',
	styleUrls: ['./action-type-icon.component.scss']
})
export class ActionTypeIconComponent implements OnInit {
	@Input() type?: ActionType;

	constructor() {
	}

	ngOnInit(): void {
	}

}
