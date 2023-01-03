import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type ByteEncodingType = 'base64' | 'hex' | 'utf-8';

@Component({
	selector: 'app-bytes-input',
	templateUrl: './bytes-input.component.html',
	styleUrls: ['./bytes-input.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => BytesInputComponent),
			multi: true,
		},
	],
})
export class BytesInputComponent implements OnInit, ControlValueAccessor {
	@Output() changed: EventEmitter<Buffer> = new EventEmitter<Buffer>();
	@Input() cols = 200;
	@Input() rows = 2;
	@Input() encodingMethods: ByteEncodingType[] = ['utf-8', 'hex', 'base64'];
	@Input() disabled = false;

	@Input() set value(val: Buffer) {
		this.val = val;
		this.onChange(val);
		this.onTouch();
	}

	method: ByteEncodingType = 'utf-8';

	private onChange: Function = () => null;
	private onTouch: Function = () => null;
	val: Buffer = Buffer.from([]);

	stringValue: string = '';

	constructor() {
	}

	ngOnInit() {
	}

	debug(): void {
		console.log('DEBUG', this.val.toString(this.method));
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	onChangeEncodingMethod(v: string): void {
		this.method = v as ByteEncodingType;

		this.onChange(this.val);
		this.onTouch();
	}

	writeValue(value: Buffer) {
		this.val = value;
	}

	registerOnChange(fn: any) {
		this.onChange = fn;
	}

	registerOnTouched(fn: any) {
		this.onTouch = fn;
	}

	onChangedValue(e: Event): void {
		const data = (<HTMLTextAreaElement>e.target).value;
		this.val = Buffer.from(data, this.method);
		this.onChange(this.val);
		this.onTouch();
		this.changed.emit(this.val);
	}
}
