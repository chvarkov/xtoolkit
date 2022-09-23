import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-bool-input',
	templateUrl: './bool-input.component.html',
	styleUrls: ['./bool-input.component.scss']
})
export class BoolInputComponent implements OnInit {
	@Input() nullable = false;
	@Input() placeholder = 'bool';
	@Output() onChange: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor() {
	}

	ngOnInit(): void {
	}

}
