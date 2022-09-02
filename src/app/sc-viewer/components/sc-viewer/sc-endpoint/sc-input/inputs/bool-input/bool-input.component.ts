import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectElement } from '../../../../../../../core/ui/select/select.component';

@Component({
	selector: 'app-bool-input',
	templateUrl: './bool-input.component.html',
	styleUrls: ['./bool-input.component.scss']
})
export class BoolInputComponent implements OnInit {
	@Input() nullable = false;
	@Input() placeholder = 'bool';
	@Output() onChange: EventEmitter<boolean> = new EventEmitter<boolean>();

	options: SelectElement[] = [];

	constructor() {
	}

	ngOnInit(): void {
		if (this.nullable) {
			this.options = [{name: 'null', value: null}];
		}

		this.options.push(
			{ name: 'true', value: true },
			{ name: 'false', value: false },
		);
	}

}
