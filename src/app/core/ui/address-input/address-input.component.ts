import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { Store } from '@ngrx/store';
import { INetworkEnvironment } from '../../elrond/interfaces/network-environment';
import { Observable } from 'rxjs';
import { NetworkSelector } from '../../../network/store/network.selector';
import { isValidAddress } from '../../validators/address-validator';

@Component({
	selector: 'app-address-input',
	templateUrl: './address-input.component.html',
	styleUrls: ['./address-input.component.scss']
})
export class AddressInputComponent implements OnInit {
	@Input() chainId: string = ''
	@Input() address: string = '';

	@Output() change: EventEmitter<string> = new EventEmitter<string>();

	network$?: Observable<INetworkEnvironment | undefined>;

	private prevValue?: string;

	constructor(readonly clipboard: Clipboard,
				private readonly store: Store) {
	}

	ngOnInit(): void {
		this.network$ = this.store.select(NetworkSelector.networkByChainId(this.chainId));
	}

	explore(url: string): void {
		window.open(`${url}/accounts/${this.address}`, '_blank');
	}

	isInvalidAddress(address: string): boolean {
		return !isValidAddress(address);
	}

	onChangeAddress(event: Event): void {
		const value = (<HTMLInputElement>(event.target)).value;

		if (this.prevValue !== value) {
			this.prevValue = value;
			this.change.next(value);
		}
	}
}
