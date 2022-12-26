import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'app-bool-input',
	templateUrl: './bool-input.component.html',
	styleUrls: ['./bool-input.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => BoolInputComponent),
			multi: true
		},
	],
})
export class BoolInputComponent implements OnInit, ControlValueAccessor {
	@Input() nullable = false;
	@Input() placeholder = 'bool';
	@Output() changed: EventEmitter<boolean | null> = new EventEmitter<boolean | null>();

	onChange: any = () => {}
	onTouch: any = () => {}

	isDisabled = false;

	val: boolean | null = false;

	constructor() {
	}

	ngOnInit(): void {
	}

	set value(val: boolean | null) {
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

	onChangeValue(value: boolean | null): void {
		this.changed.emit(value);
		this.onChange(value);
		this.onTouch();
	}
}
