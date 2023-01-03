import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Type, VariadicType } from '@elrondnetwork/erdjs/out';
import {
	ControlValueAccessor,
	FormArray,
	FormBuilder,
	FormControl,
	FormGroup,
	NG_VALUE_ACCESSOR
} from '@angular/forms';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-array-input',
	templateUrl: './array-input.component.html',
	styleUrls: ['./array-input.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ArrayInputComponent),
			multi: true,
		},
	],
})
export class ArrayInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
	@Input() projectId: string = '';
	@Input() chainId: string = '';
	@Input() name: string = '';
	@Input() type!: VariadicType;

	@Input() set value(val: Record<string, any>) {
		this.form.setValue(val);
		this.onChange(val)
		this.onTouch(val)
	}

	@Output() changed: EventEmitter<any[]> = new EventEmitter<any[]>();

	form!: FormGroup;

	isDisabled = false;

	onChange: any = () => {};
	onTouch: any = () => {};

	private readonly sub = new Subscription();

	get list(): FormArray {
		return this.form.get('list') as FormArray;
	}

	get unwrappedType(): Type | undefined {
		if (!this.type) {
			return undefined;
		}

		return this.type.getFirstTypeParameter();
	}

	constructor(private readonly fb: FormBuilder) {
		this.form = this.fb.group({
			list: this.fb.array([]),
		});

		this.sub.add(this.list.valueChanges.subscribe(data => {
			this.onChangeList(data);
		}));
	}

	ngOnInit(): void {
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	addElement(): void {
		this.list.push(new FormControl());
	}

	moveItem(prevIndex: number, currentIndex: number): void {
		const arr = this.list.value;

		moveItemInArray(arr, prevIndex, currentIndex);

		this.list.controls.forEach((ctrl, index) => {
			ctrl.setValue(arr[index]);
		});
	}

	delete(index: number): void {
		this.list.removeAt(index);
	}

	clear(): void {
		this.list.clear({emitEvent: true});
	}

	onChangeList(data: any[]): void {
		this.changed.emit(data);
		this.onChange(data);
		this.onTouch();
	}

	writeValue(value: any){
		this.list.setValue(value);
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
