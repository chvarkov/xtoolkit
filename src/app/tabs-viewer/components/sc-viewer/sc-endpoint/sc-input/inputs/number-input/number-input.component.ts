import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
	BigIntType,
	BigUIntType,
	I16Type,
	I32Type,
	I64Type,
	I8Type,
	Type,
	U16Type,
	U32Type,
	U64Type,
	U8Type
} from '@elrondnetwork/erdjs/out';
import BigNumber from 'bignumber.js';

@Component({
	selector: 'app-number-input',
	templateUrl: './number-input.component.html',
	styleUrls: ['./number-input.component.scss']
})
export class NumberInputComponent implements OnInit {
	readonly maxLength = 39;

	@Input() value: BigNumber = new BigNumber(0);
	@Input() type?: Type;
	@Output() changed: EventEmitter<BigNumber> = new EventEmitter<BigNumber>();

	constructor() {
	}

	ngOnInit(): void {
	}

	getMin(): BigNumber {
		if (!this.type) {
			return new BigNumber(0);
		}

		switch (true) {
			case this.type instanceof I8Type:
				return new BigNumber(2).pow(8).dividedBy(2).minus(1);
			case this.type instanceof I16Type:
				return new BigNumber(2).pow(16).dividedBy(2).minus(1);
			case this.type instanceof I32Type:
				return new BigNumber(2).pow(32).dividedBy(2).minus(1);
			case this.type instanceof I64Type:
				return new BigNumber(2).pow(64).dividedBy(2).minus(1);
			case this.type instanceof BigIntType:
				return new BigNumber(2).pow(128).dividedBy(2).minus(1);
			case this.type instanceof U8Type:
			case this.type instanceof U16Type:
			case this.type instanceof U32Type:
			case this.type instanceof U64Type:
			case this.type instanceof BigUIntType:
				return new BigNumber(0);
			default:
				throw new Error('input type is not numerical');
		}
	}

	getMax(): BigNumber {
		if (!this.type) {
			return new BigNumber(0);
		}

		switch (true) {
			case this.type instanceof I8Type:
				return new BigNumber(2).pow(8).dividedBy(2);
			case this.type instanceof I16Type:
				return new BigNumber(2).pow(16).dividedBy(2);
			case this.type instanceof I32Type:
				return new BigNumber(2).pow(32).dividedBy(2);
			case this.type instanceof I64Type:
				return new BigNumber(2).pow(64).dividedBy(2);
			case this.type instanceof BigIntType:
				return new BigNumber(2).pow(128).dividedBy(2);
			case this.type instanceof U8Type:
				return new BigNumber(2).pow(8);
			case this.type instanceof U16Type:
				return new BigNumber(2).pow(16);
			case this.type instanceof U32Type:
				return new BigNumber(2).pow(32);
			case this.type instanceof U64Type:
				return new BigNumber(2).pow(64);
			case this.type instanceof BigUIntType:
				return new BigNumber(2).pow(128);
			default:
				throw new Error('input type is not numerical');
		}
	}

	onChange(e: Event): void {
		const value = (<HTMLInputElement>e.target).value;

		this.value = new BigNumber(value);

		this.changed.emit(this.value);
	}
}
