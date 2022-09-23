import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EnumType, EnumVariantDefinition, Type } from '@elrondnetwork/erdjs/out';

@Component({
	selector: 'app-enum-input',
	templateUrl: './enum-input.component.html',
	styleUrls: ['./enum-input.component.scss']
})
export class EnumInputComponent implements OnInit {
	@Input() type?: Type;
	@Output() changed: EventEmitter<number> = new EventEmitter<number>();

	constructor() {
	}

	ngOnInit(): void {

	}

	getEnum(): EnumVariantDefinition[] {
		if (!(this.type instanceof EnumType)) {
			throw new Error('Type is not enum');
		}

		return this.type.variants;
	}
}
