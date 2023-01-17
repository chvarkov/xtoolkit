import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
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
	U8Type,
} from '@multiversx/sdk-core/out';
import BigNumber from 'bignumber.js';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'app-number-input',
	templateUrl: './number-input.component.html',
	styleUrls: ['./number-input.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => NumberInputComponent),
			multi: true,
		},
	],
})
export class NumberInputComponent implements OnInit, ControlValueAccessor {
	readonly maxLength = 39;

	@Input() set value(val: BigNumber) {
		this.onChange(val);
		this.onTouch(val);
		this.val = val;
	}

	get value(): BigNumber {
		return this.val;
	}

	private val: BigNumber = new BigNumber(0);

	@Input() type?: Type;
	@Output() changed: EventEmitter<BigNumber> = new EventEmitter<BigNumber>();

	onChange: any = () => {};
	onTouch: any = () => {};

	isDisabled = false;

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

	onChangeEvent(e: Event): void {
		const value = (<HTMLInputElement>e.target).value;

		this.val = new BigNumber(value);

		this.changed.emit(this.val);
		this.onChange(this.val);
		this.onTouch();
	}


	writeValue(value: any){
		this.value = value
	}

	registerOnChange(fn: any){
		this.onChange = fn
	}

	registerOnTouched(fn: any){
		this.onTouch = fn
	}

	setDisabledState(isDisabled: boolean) {
		this.isDisabled = isDisabled;
	}
}
