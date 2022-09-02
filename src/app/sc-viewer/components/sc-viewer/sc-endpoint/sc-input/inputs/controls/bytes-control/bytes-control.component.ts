import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type ByteEncodingType = 'decimal' | 'raw' | 'hex' | 'text';

@Component({
	selector: 'app-bytes-control',
	templateUrl: './bytes-control.component.html',
	styleUrls: ['./bytes-control.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => BytesControlComponent),
			multi: true
		},
	],
})
export class BytesControlComponent implements ControlValueAccessor {
	@Input() cols = 100;
	@Input() rows = 2;
	@Input() encodingMethods: ByteEncodingType[] = ['decimal', 'raw', 'raw', 'text'];
	@Input() disabled = false;

	private onChange: Function = () => null;
	private onTouch: Function = () => null;
	private _value = '';

	constructor() {
	}

	ngOnInit() {
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	set value(val: string) {
		this._value = val
		this.onChange(val)
		this.onTouch(val)
	}

	get value(): string {
		return this._value;
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
}
