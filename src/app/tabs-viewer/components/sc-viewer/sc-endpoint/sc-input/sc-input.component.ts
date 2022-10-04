import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
	AddressType, ArrayVecType,
	BooleanType,
	BytesType,
	EndpointParameterDefinition,
	EnumType, StructType,
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

	val = '';

	set value(val: string) {
		this.val = val
		this.onChange(val)
		this.onTouch(val)
	}

	get value(): string {
		return this.val;
	}

	writeValue(value: any) {
		this.value = value
	}

	registerOnChange(fn: any) {
		this.onChange = fn
	}

	registerOnTouched(fn: any) {
		this.onTouch = fn
	}

	isBoolType(): boolean {
		return this.type instanceof BooleanType;
	}

	isNumericalType(): boolean {
		return this.type instanceof NumericalType;
	}

	isBytesType(): boolean {
		return this.type instanceof BytesType;
	}

	isEnum(): boolean {
		return this.type instanceof EnumType;
	}

	isAddress(): boolean {
		return this.type instanceof AddressType;
	}

	isTokenIdentifier(): boolean {
		return this.type instanceof TokenIdentifierType;
	}

	isStruct(): boolean {
		return this.type instanceof StructType;
	}

	isVariadic(): boolean {
		return this.type instanceof VariadicType;
	}

	isArray(): boolean {
		return this.type instanceof ArrayVecType;
	}
}
