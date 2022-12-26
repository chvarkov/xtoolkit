import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { EnumType, EnumVariantDefinition, Type } from '@elrondnetwork/erdjs/out';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'app-enum-input',
	templateUrl: './enum-input.component.html',
	styleUrls: ['./enum-input.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => EnumInputComponent),
			multi: true,
		},
	],
})
export class EnumInputComponent implements OnInit, ControlValueAccessor {
	@Input() type?: Type;
	@Output() changed: EventEmitter<number | null> = new EventEmitter<number | null>();

	onChange: any = () => {}
	onTouch: any = () => {}

	isDisabled = false;

	val = 0;

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

	set value(val: number) {
		this.val = val
		this.onChange(val)
		this.onTouch(val)
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

	onChangeValue(value: number | null): void {
		this.changed.emit(value);
		this.onChange(value);
		this.onTouch();
	}
}
