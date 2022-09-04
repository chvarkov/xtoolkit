import { Component, OnInit } from '@angular/core';
import { SelectElement } from '../../../../../../../core/ui/select/select.component';

@Component({
	selector: 'app-number-input',
	templateUrl: './number-input.component.html',
	styleUrls: ['./number-input.component.scss']
})
export class NumberInputComponent implements OnInit {
	default: SelectElement = {
		name: 'dec',
		value: 'dec',
	};

	constructor() {
	}

	ngOnInit(): void {
	}

}
