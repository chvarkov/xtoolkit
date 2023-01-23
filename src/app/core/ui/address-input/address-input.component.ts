import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { INetworkEnvironment } from '../../elrond/interfaces/network-environment';
import { Observable, of } from 'rxjs';
import { NetworkSelector } from '../../../network/store/network.selector';
import { isValidAddress } from '../../validators/address-validator';
import { ProjectAddress } from '../../data-provider/data-provider';
import { ProjectSelector } from '../../../project/store/project.selector';
import { map } from 'rxjs/operators';
import { ClipboardService } from '../../services/clipboard.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import BigNumber from 'bignumber.js';

@Component({
	selector: 'app-address-input',
	templateUrl: './address-input.component.html',
	styleUrls: ['./address-input.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => AddressInputComponent),
			multi: true,
		},
	],
})
export class AddressInputComponent implements OnInit, ControlValueAccessor {
	@Input() projectId: string = ''
	@Input() chainId: string = ''
	@Input() type?: 'sc' | 'wallet';
	@Input() options: ProjectAddress[] = [];
	@Input() showAddressBook = true;
	@Input() set value(val: string) {
		this.onChange(val);
		this.onTouch(val);
		this.val = val;
	}

	get value(): string {
		return this.val;
	}

	val: string = '';

	@Output() changed: EventEmitter<string> = new EventEmitter<string>();


	onChange: any = () => {};
	onTouch: any = () => {};

	isDisabled = false;

	isOptionsVisible = false;

	network$?: Observable<INetworkEnvironment | undefined>;

	addressBook$?: Observable<ProjectAddress[] | undefined>;

	private prevValue?: string;

	constructor(readonly clipboard: ClipboardService,
				private readonly store: Store) {
	}

	ngOnInit(): void {
		if (this.showAddressBook) {
			this.network$ = this.store.select(NetworkSelector.networkByChainId(this.chainId));
			this.addressBook$ = this.store.select(ProjectSelector.projectAddresses(this.type))
				.pipe(map(list => this.options.concat(list)));
		}
	}

	onFocus(): void {
		this.isOptionsVisible = true;
	}

	onBlur(): void {
		setTimeout(() => this.isOptionsVisible = false, 200);
	}

	explore(url: string): void {
		window.open(`${url}/accounts/${this.value}`, '_blank');
	}

	isInvalidAddress(address: string): boolean {
		return !isValidAddress(address);
	}

	onChangeAddress(event: Event): void {
		const value = (<HTMLInputElement>(event.target)).value;

		this.setValue(value);
	}

	onChangeEvent(e: Event): void {
		this.val = (<HTMLInputElement>e.target).value;

		this.changed.emit(this.val);
		this.onChange(this.val);
		this.onTouch();

		this.isOptionsVisible = false;
	}

	setValue(value: string): void {
		if (this.prevValue !== value) {
			this.prevValue = value;
			this.changed.next(value);
		}
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
}
