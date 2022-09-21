import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TokenIdentifierValue } from '@elrondnetwork/erdjs/out';

@Component({
	selector: 'app-token-identifier-input',
	templateUrl: './token-identifier-input.component.html',
	styleUrls: ['./token-identifier-input.component.scss']
})
export class TokenIdentifierInputComponent implements OnInit {
	@Output() changed: EventEmitter<string> = new EventEmitter<string>();

	constructor() {
	}

	ngOnInit(): void {
	}

	onChange(e: Event): void {
		const value = (<HTMLInputElement>e.target).value;

		this.changed.emit(value);
	}

	setEgldIdentifier(input: HTMLInputElement): void {
		input.value = TokenIdentifierValue.egld().valueOf();
		this.changed.emit(input.value);
	}
}
