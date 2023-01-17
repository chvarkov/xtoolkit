import { Component, Input, OnInit } from '@angular/core';
import { TypedValue } from '@multiversx/sdk-core/out';

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

	transformValue(value: any): string {
		if (value == null) {
			return 'null';
		}

		if (typeof value === 'object' || Array.isArray(value)) {
			return JSON.stringify(value, null, 4);
		}

		return value.toString();
	}
}
