import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BooleanType, BytesType, EndpointParameterDefinition } from '@elrondnetwork/erdjs/out';
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
	@Input() input?: EndpointParameterDefinition;


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
		return this.input?.type instanceof BooleanType;
	}

	isNumericalType(): boolean {
		return this.input?.type instanceof NumericalType;
	}

	isBytesType(): boolean {
		return this.input?.type instanceof BytesType;
	}
}
