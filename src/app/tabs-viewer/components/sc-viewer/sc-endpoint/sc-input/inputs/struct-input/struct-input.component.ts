import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FieldDefinition, StructType, Type } from '@elrondnetwork/erdjs/out';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-struct-input',
	templateUrl: './struct-input.component.html',
	styleUrls: ['./struct-input.component.scss']
})
export class StructInputComponent implements OnInit, OnDestroy {
	@Output() changed: EventEmitter<Record<string, any>> = new EventEmitter<Record<string, any>>();

	@Input() projectId: string = '';
	@Input() chainId: string = '';
	@Input() name: string = '';
	@Input() type?: Type;

	form!: FormGroup;

	private readonly sub = new Subscription();

	constructor(private readonly fb: FormBuilder) {
	}

	getFields(): FieldDefinition[] {
		if (!(this.type instanceof StructType)) {
			throw new Error('Type is not struct');
		}

		return this.type.getFieldsDefinitions();
	}

	ngOnInit(): void {
		this.form = this.fb.group(
			(this.getFields() || [])
				.map(i => ({[i.name]: new FormControl('')}))
				.reduce((p, c) => ({...p, ...c}), {}),
		);

		this.sub.add(this.form.valueChanges.subscribe(v => {
			console.log('form_value', v);

			this.changed.next(v);
		}));
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}
}
