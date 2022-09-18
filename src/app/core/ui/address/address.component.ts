import { Component, Input, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../../elrond/interfaces/network-environment';
import { Store } from '@ngrx/store';
import { NetworkSelector } from '../../../network/store/network.selector';

@Component({
	selector: 'app-address',
	templateUrl: './address.component.html',
	styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
	@Input() chainId: string = '';

    @Input() address: string = '';

    @Input() label: string = '';

	network$?: Observable<INetworkEnvironment | undefined>;

	constructor(private readonly clipboard: Clipboard,
				private readonly store: Store) {
	}

	ngOnInit(): void {
		this.network$ = this.store.select(NetworkSelector.networkByChainId(this.chainId));
	}

	copy(): void {
		this.clipboard.copy(this.address);
	}

	explore(url: string): void {
		window.open(`${url}/accounts/${this.address}`, '_blank');
	}
}
