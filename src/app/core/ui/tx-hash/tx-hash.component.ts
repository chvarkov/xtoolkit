import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../../elrond/interfaces/network-environment';
import { Clipboard } from '@angular/cdk/clipboard';
import { Store } from '@ngrx/store';
import { NetworkSelector } from '../../../network/store/network.selector';

@Component({
	selector: 'app-tx-hash',
	templateUrl: './tx-hash.component.html',
	styleUrls: ['./tx-hash.component.scss']
})
export class TxHashComponent implements OnInit {
	@Input() chainId: string = '';

	@Input() txHash: string = '';

	@Input() label: string = '';

	network$?: Observable<INetworkEnvironment | undefined>;

	constructor(private readonly clipboard: Clipboard,
				private readonly store: Store) {
	}

	ngOnInit(): void {
		this.network$ = this.store.select(NetworkSelector.networkByChainId(this.chainId));
	}

	copy(): void {
		this.clipboard.copy(this.txHash);
	}

	explore(url: string): void {
		window.open(`${url}/transactions/${this.txHash}`, '_blank');
	}
}
