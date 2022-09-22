import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FieldDefinition, StructType, Type } from '@elrondnetwork/erdjs/out';

@Component({
	selector: 'app-struct-input',
	templateUrl: './struct-input.component.html',
	styleUrls: ['./struct-input.component.scss']
})
export class StructInputComponent implements OnInit {
	@Output() changed: EventEmitter<Record<string, any>> = new EventEmitter<Record<string, any>>();

	@Input() chainId: string = '';
	@Input() name: string = '';
	@Input() type?: Type;

	constructor() {
	}

	getFields(): FieldDefinition[] {
		if (!(this.type instanceof StructType)) {
			throw new Error('Type is not struct');
		}

		return this.type.getFieldsDefinitions();
	}

	ngOnInit(): void {
	}

}
