import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { Store } from '@ngrx/store';
import { INetworkEnvironment } from '../../elrond/interfaces/network-environment';
import { Observable, of } from 'rxjs';
import { NetworkSelector } from '../../../network/store/network.selector';
import { isValidAddress } from '../../validators/address-validator';
import { ProjectAddress } from '../../data-provider/data-provider';
import { ProjectSelector } from '../../../project/store/project.selector';

@Component({
	selector: 'app-address-input',
	templateUrl: './address-input.component.html',
	styleUrls: ['./address-input.component.scss']
})
export class AddressInputComponent implements OnInit {
	@Input() projectId: string = ''
	@Input() chainId: string = ''
	@Input() address: string = '';
	@Input() type?: 'sc' | 'wallet';
	@Output() changed: EventEmitter<string> = new EventEmitter<string>();

	@Input() showAddressBook = true;

	isOptionsVisible = false;

	network$?: Observable<INetworkEnvironment | undefined>;

	addressBook$?: Observable<ProjectAddress[] | undefined>;

	private prevValue?: string;

	constructor(readonly clipboard: Clipboard,
				private readonly store: Store) {
	}

	ngOnInit(): void {
		if (this.showAddressBook) {
			this.network$ = this.store.select(NetworkSelector.networkByChainId(this.chainId));
			this.addressBook$ = this.store.select(ProjectSelector.projectAddresses(this.projectId, this.type));
		}
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

	onSelectAddress(savedAddress: ProjectAddress): void {
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
