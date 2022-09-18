import { Component, Input, OnInit } from '@angular/core';
import { ActionHistoryElement } from '../../../core/data-provider/data-provider';

@Component({
	selector: 'app-action',
	templateUrl: './action.component.html',
	styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
	@Input() data?: ActionHistoryElement;

	constructor() {
	}

	ngOnInit(): void {
	}

}
