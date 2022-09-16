import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ScInputComponent } from './sc-input/sc-input.component';
import { EndpointDefinition, SmartContract } from '@elrondnetwork/erdjs/out';
import { Observable, of, Subject } from 'rxjs';
import { ScQueryRunner } from '../../../../core/elrond/services/sc-query-runner';
import { INetworkEnvironment } from '../../../../core/elrond/interfaces/network-environment';
import { Store } from '@ngrx/store';
import { NetworkSelector } from '../../../../network/store/network.selector';

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
	isShowing = false;

	@Input() sc!: SmartContract;

	@Input() endpoint?: EndpointDefinition;

	form!: FormGroup;

	resultSubject = new Subject();

	network$: Observable<INetworkEnvironment>;

	constructor(private readonly fb: FormBuilder,
				private readonly store: Store,
				private readonly scQueryRunner: ScQueryRunner) {
		this.network$ = this.store.select(NetworkSelector.selectedNetwork);
	}

	ngOnInit(): void {
		this.form = this.fb.group(
			(this.endpoint?.input || [])
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
		const args = (this.endpoint?.input || []).map(i => `${i.name}: ${i.type}`);

		return `(${args.join(', ')})`;
	}

	async sendQuery(network: INetworkEnvironment): Promise<void> {
		if (!this.endpoint) {
			return;
		}

		const query = this.scQueryRunner.createQuery(this.sc, {
			payload: this.form.value,
			functionName: this.endpoint.name,
		});

		const queryResult = await this.scQueryRunner.runQuery(network, query);

		this.resultSubject.next(queryResult.toJSON());
	}
}
