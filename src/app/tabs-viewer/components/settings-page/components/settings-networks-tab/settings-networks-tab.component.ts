import { Component, OnInit } from '@angular/core';
import { DEFAULT_NETWORKS } from '../../../../../core/constants';
import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../../../../../core/elrond/interfaces/network-environment';
import { Store } from '@ngrx/store';
import { NetworkSelector } from '../../../../../network/store/network.selector';
import { NetworkAction } from '../../../../../network/store/network.action';

@Component({
	selector: 'app-settings-networks-tab',
	templateUrl: './settings-networks-tab.component.html',
	styleUrls: ['./settings-networks-tab.component.scss'],
})
export class SettingsNetworksTabComponent implements OnInit {
	defaultChainIds = DEFAULT_NETWORKS.map(n => n.chainId);

	networks$?: Observable<INetworkEnvironment[] | undefined>;

	constructor(private readonly store: Store) {
	}

	ngOnInit(): void {
		this.networks$ = this.store.select(NetworkSelector.networks);
	}

	addNetwork(): void {
		this.store.dispatch(NetworkAction.addNetwork());
	}

	updateNetwork(network: INetworkEnvironment): void {
		this.store.dispatch(NetworkAction.updateNetwork({network}));
	}

	syncNetwork(network: INetworkEnvironment): void {
		this.store.dispatch(NetworkAction.syncNetwork({network}));
	}

	deleteNetwork(chainId: string): void {
		this.store.dispatch(NetworkAction.deleteNetwork({chainId}));
	}
}
