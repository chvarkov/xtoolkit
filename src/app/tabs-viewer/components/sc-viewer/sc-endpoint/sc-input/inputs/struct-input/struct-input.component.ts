import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FieldDefinition, StructType, Type } from '@elrondnetwork/erdjs/out';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-struct-input',
	templateUrl: './struct-input.component.html',
	styleUrls: ['./struct-input.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => StructInputComponent),
			multi: true,
		},
	],
})
export class StructInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
	@Output() changed: EventEmitter<Record<string, any>> = new EventEmitter<Record<string, any>>();

	@Input() projectId: string = '';
	@Input() chainId: string = '';
	@Input() name: string = '';
	@Input() type?: Type;

	@Input() set value(val: Record<string, any>) {
		this.form?.setValue(val);
		this.onChange(val)
		this.onTouch(val)
	}

	form!: FormGroup;

	onChange: any = () => {};
	onTouch: any = () => {};

	isDisabled = false;

	private readonly sub = new Subscription();

	constructor(private readonly fb: FormBuilder) {
	}

	getFields(): FieldDefinition[] {
		if (!(this.type instanceof StructType)) {
			throw new Error(`Type "${this.type?.getClassName() || ''}" is not struct`);
		}

		return this.type.getFieldsDefinitions();
	}

	ngOnInit(): void {
		this.form = this.fb.group(
			(this.getFields() || [])
				.map(i => ({[i.name]: new FormControl('')}))
				.reduce((p, c) => ({...p, ...c}), {}),
		);

		this.sub.add(this.form.valueChanges.subscribe(data => {
			this.onChangeForm(data);
		}));
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}

	onChangeForm(data: Record<string, any>): void {
		this.changed.emit(data);
		this.onChange(data);
		this.onTouch();
	}

	writeValue(value: any){
		this.form.setValue(value);
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
