import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { Store } from '@ngrx/store';
import { INetworkEnvironment } from '../../elrond/interfaces/network-environment';
import { Observable, of } from 'rxjs';
import { NetworkSelector } from '../../../network/store/network.selector';
import { isValidAddress } from '../../validators/address-validator';
import { SavedAddress } from '../../data-provider/personal-settings.manager';

@Component({
	selector: 'app-address-input',
	templateUrl: './address-input.component.html',
	styleUrls: ['./address-input.component.scss']
})
export class AddressInputComponent implements OnInit {
	@Input() chainId: string = ''
	@Input() address: string = '';

	@Output() changed: EventEmitter<string> = new EventEmitter<string>();

	isOptionsVisible = false;

	network$?: Observable<INetworkEnvironment | undefined>;

	savedAddress$?: Observable<SavedAddress[]> = of([
		{
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'wallet',
			savedAt: Date.now(),
		},
		{
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'sc',
			savedAt: Date.now(),
		},
		{
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'wallet',
			savedAt: Date.now(),
		},
		{
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'sc',
			savedAt: Date.now(),
		},
	]);

	private prevValue?: string;

	constructor(readonly clipboard: Clipboard,
				private readonly store: Store) {
	}

	ngOnInit(): void {
		this.network$ = this.store.select(NetworkSelector.networkByChainId(this.chainId));
	}

	onFocus(): void {
		this.isOptionsVisible = true;
	}

	onBlur(): void {
		setTimeout(() => this.isOptionsVisible = false, 200);
	}

	explore(url: string): void {
		window.open(`${url}/accounts/${this.address}`, '_blank');
	}

	isInvalidAddress(address: string): boolean {
		return !isValidAddress(address);
	}

	onChangeAddress(event: Event): void {
		const value = (<HTMLInputElement>(event.target)).value;

		this.setValue(value);
	}

	onSelectAddress(savedAddress: SavedAddress): void {
		this.setValue(savedAddress.address);

		this.address = savedAddress.address;

		this.isOptionsVisible = false;
	}

	setValue(value: string): void {
		if (this.prevValue !== value) {
			this.prevValue = value;
			this.changed.next(value);
		}
	}
}
