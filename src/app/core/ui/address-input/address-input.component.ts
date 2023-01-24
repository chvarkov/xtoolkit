import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { INetworkEnvironment } from '../../elrond/interfaces/network-environment';
import { Observable } from 'rxjs';
import { NetworkSelector } from '../../../network/store/network.selector';
import { isValidAddress } from '../../validators/address-validator';
import { ProjectAddress } from '../../data-provider/data-provider';
import { ProjectSelector } from '../../../project/store/project.selector';
import { filter, map, take } from 'rxjs/operators';
import { ClipboardService } from '../../services/clipboard.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AddressBookBottomSheetComponent } from '../address-book-bottom-sheet/address-book-bottom-sheet.component';

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

	network$?: Observable<INetworkEnvironment | undefined>;

	addressBook$?: Observable<ProjectAddress[] | undefined>;

	private prevValue?: string;

	constructor(readonly clipboard: ClipboardService,
				private readonly bottomSheet: MatBottomSheet,
				private readonly store: Store) {
	}

	ngOnInit(): void {
		this.network$ = this.store.select(NetworkSelector.networkByChainId(this.chainId));
		if (this.showAddressBook) {
			this.addressBook$ = this.store.select(ProjectSelector.projectAddresses(this.type))
				.pipe(map(list => this.options.concat(list)));
		}
	}

	explore(url: string): void {
		window.open(`${url}/accounts/${this.value}`, '_blank');
	}

	isInvalidAddress(address: string): boolean {
		return !isValidAddress(address);
	}

	onChangeEvent(e: Event): void {
		this.val = (<HTMLInputElement>e.target).value;

		this.changed.emit(this.val);
		this.onChange(this.val);
		this.onTouch();
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

	selectFromAddressBook(): void {
		this.bottomSheet.open(AddressBookBottomSheetComponent).afterDismissed()
			.pipe(
				take(1),
				filter(v => !!v),
			).subscribe((projectAddress) => this.value = projectAddress.address);
	}
}
