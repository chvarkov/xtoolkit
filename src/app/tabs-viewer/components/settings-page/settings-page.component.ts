import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { INetworkEnvironment } from '../../../core/elrond/interfaces/network-environment';
import { NetworkSelector } from '../../../network/store/network.selector';
import { NetworkAction } from '../../../network/store/network.action';
import { DEFAULT_NETWORKS } from '../../../core/constants';

@Component({
	selector: 'app-settings-page',
	templateUrl: './settings-page.component.html',
	styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
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

	deleteNetwork(chainId: string): void {
		this.store.dispatch(NetworkAction.deleteNetwork({chainId}));
	}
}
