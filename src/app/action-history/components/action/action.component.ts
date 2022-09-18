import { Component, Input, OnInit } from '@angular/core';
import { IElrondTransaction } from '../../../core/elrond/interfaces/elrond-transaction';

@Component({
	selector: 'app-action',
	templateUrl: './action.component.html',
	styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
	@Input() tx?: IElrondTransaction;

	constructor() {
	}

	ngOnInit(): void {
	}

}
