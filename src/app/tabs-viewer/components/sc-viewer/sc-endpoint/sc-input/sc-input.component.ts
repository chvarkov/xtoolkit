import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
	AddressType, ArrayVecType,
	BooleanType,
	BytesType,
	EnumType, OptionalType, StructType,
	TokenIdentifierType, Type, VariadicType
} from '@elrondnetwork/erdjs/out';
import { NumericalType } from '@elrondnetwork/erdjs/out/smartcontracts/typesystem/numerical';

@Component({
	selector: 'app-sc-input',
	templateUrl: './sc-input.component.html',
	styleUrls: ['./sc-input.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ScInputComponent),
			multi: true
		},
	],
})
export class ScInputComponent implements OnInit, ControlValueAccessor {
	@Input() projectId: string = '';

	@Input() chainId: string = '';

	@Input() name: string = '';
	@Input() type?: Type;


	private onChange: Function = () => null;
	private onTouch: Function = () => null;


	constructor() {
	}

	ngOnInit() {
	}

	setDisabledState(isDisabled: boolean): void {
		// this.disabled = isDisabled;
	}

	val: any;

	get unwrappedType(): Type | undefined {
		if (!this.type) {
			return undefined;
		}

		if (!this.isOptional()) {
			return this.type;
		}

		return this.type.getFirstTypeParameter();
	}

	set value(val: any) {
		this.val = val
		this.onChange(val)
		this.onTouch(val)
	}

	get value(): any {
		return this.val;
	}

	writeValue(value: any) {
		this.value = value;
	}

	registerOnChange(fn: any) {
		this.onChange = fn
	}

	registerOnTouched(fn: any) {
		this.onTouch = fn
	}

	isBoolType(): boolean {
		return this.unwrappedType instanceof BooleanType;
	}

	isNumericalType(): boolean {
		return this.unwrappedType instanceof NumericalType;
	}

	isBytesType(): boolean {
		return this.unwrappedType instanceof BytesType;
	}

	isEnum(): boolean {
		return this.unwrappedType instanceof EnumType;
	}

	isAddress(): boolean {
		return this.unwrappedType instanceof AddressType;
	}

	isTokenIdentifier(): boolean {
		return this.unwrappedType instanceof TokenIdentifierType;
	}

	isStruct(): boolean {
		return this.unwrappedType instanceof StructType;
	}

	isVariadic(): boolean {
		return this.unwrappedType instanceof VariadicType;
	}

	isArray(): boolean {
		return this.unwrappedType instanceof ArrayVecType;
	}

	isOptional(): boolean {
		return this.type instanceof OptionalType;
	}
}
