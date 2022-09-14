import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ScInputComponent } from './sc-input/sc-input.component';
import { IScEndpoint } from '../../../../core/elrond/interfaces/sc-abi';

@Component({
	selector: 'app-sc-endpoint',
	templateUrl: './sc-endpoint.component.html',
	styleUrls: ['./sc-endpoint.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ScInputComponent),
			multi: true
		},
	],
})
export class ScEndpointComponent implements OnInit {
	test = '';
	isShowing = false;

	@Input() endpoint: IScEndpoint = {
		name: '',
		inputs: [],
		outputs: [],
	};

	form!: FormGroup;

	constructor(private readonly fb: FormBuilder) {
	}

	ngOnInit(): void {
		this.form = this.fb.group(
			this.endpoint.inputs
				.map(i => ({[i.name]: new FormControl('')}))
				.reduce((p, c) => ({...p, ...c}), {}),
		);
	}

	show(): void {
		this.isShowing = true;
	}

	hide(): void {
		this.isShowing = false;
	}

	getArgsPreview(): string {
		const args = this.endpoint.inputs.map(i => `${i.name}: ${i.type}`);

		return `(${args.join(', ')})`;
	}
}
