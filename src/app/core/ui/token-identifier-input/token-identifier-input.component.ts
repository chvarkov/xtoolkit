import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../../elrond/interfaces/network-environment';
import { Store } from '@ngrx/store';
import { NetworkSelector } from '../../../network/store/network.selector';
import { ProjectSelector } from '../../../project/store/project.selector';
import { map } from 'rxjs/operators';
import { TokenIdentifierValue } from '@elrondnetwork/erdjs/out';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'app-token-identifier-input',
	templateUrl: './token-identifier-input.component.html',
	styleUrls: ['./token-identifier-input.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TokenIdentifierInputComponent),
			multi: true
		}
	]
})
export class TokenIdentifierInputComponent implements OnInit, ControlValueAccessor {
	@Input() projectId: string = '';
	@Input() chainId: string = ''
	@Input() identifier: string = ''; // TODO: [ScInputValueAccessor] Delete it.
	@Input() identifierOptions: string[] = [];

	@Output() changed: EventEmitter<string> = new EventEmitter<string>();

	@Input() showIdentifiers = true;

	network$?: Observable<INetworkEnvironment | undefined>;

	tokenIdentifiers$?: Observable<string[]>;

	isDisabled = false;

	private prevValue?: string;

	onChange: any = () => {}
	onTouch: any = () => {}

	val= '';

	constructor(private readonly store: Store) {
	}

	set value(val: string) {
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

	ngOnInit(): void {
		if (this.showIdentifiers) {
			this.network$ = this.store.select(NetworkSelector.networkByChainId(this.chainId));
			this.tokenIdentifiers$ = this.store.select(ProjectSelector.activeProject()).pipe(
				map(project => project?.tokens || []),
				map(tokens => [TokenIdentifierValue.egld().toString(), ...tokens, ...this.identifierOptions]),
			);
		}
	}

	explore(url: string): void {
		window.open(`${url}/tokens/${this.val}`, '_blank');
	}

	isInvalidIdentifier(identifier: string): boolean {
		return false; // TODO: add validation
	}

	onChangeTokenIdentifier(event: MatAutocompleteSelectedEvent): void {
		this.setValue(event.option.value);
	}

	setValue(value: string): void {
		this.onChange(value);
		this.onTouch();

		if (this.prevValue !== value) {
			this.changed.next(value);
		}
	}
}
