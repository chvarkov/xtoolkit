import { Component, Input, OnInit } from '@angular/core';
import { TypedOutcomeBundle } from '@multiversx/sdk-core/out';

@Component({
	selector: 'app-sc-query-result',
	templateUrl: './sc-query-result.component.html',
	styleUrls: ['./sc-query-result.component.scss']
})
export class ScQueryResultComponent implements OnInit {

	@Input() result?: TypedOutcomeBundle;

	constructor() {
	}

	ngOnInit(): void {
	}

}
