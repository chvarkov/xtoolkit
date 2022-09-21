import { Component, Input, OnInit } from '@angular/core';
import { TypedValue } from '@elrondnetwork/erdjs/out';

@Component({
	selector: 'app-sc-query-result-element',
	templateUrl: './sc-query-result-element.component.html',
	styleUrls: ['./sc-query-result-element.component.scss']
})
export class ScQueryResultElementComponent implements OnInit {
	@Input() index = 0;
	@Input() typedValue?: TypedValue;

	constructor() {
	}

	ngOnInit(): void {
	}

}
