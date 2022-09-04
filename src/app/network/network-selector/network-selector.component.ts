import { Component, Input, OnInit } from '@angular/core';
import { DEFAULT_NETWORKS } from '../../core/constants';
import { INetworkEnvironment } from '../../core/interfaces/network-environment';
import { SelectElement } from '../../core/ui/select/select.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NetworkSelector } from '../store/network.selector';
import { NetworkAction } from '../store/network.action';

@Component({
	selector: 'app-network-selector',
	templateUrl: './network-selector.component.html',
	styleUrls: ['./network-selector.component.scss']
})
export class NetworkSelectorComponent implements OnInit {
	selectedNetwork$: Observable<INetworkEnvironment>;
	networks$: Observable<INetworkEnvironment[]>;

	defaultSelectedNetwork: INetworkEnvironment = DEFAULT_NETWORKS[0];
	defaultNetworks: INetworkEnvironment[] = DEFAULT_NETWORKS;

	constructor(private readonly store: Store) {
		this.networks$ = this.store.select(NetworkSelector.networks);
		this.selectedNetwork$ = this.store.select(NetworkSelector.selectedNetwork);
	}

	ngOnInit(): void {
	}

	mapElement(item: INetworkEnvironment | undefined): SelectElement<INetworkEnvironment> | undefined {
		if (!item) {
			return undefined;
		}

		return {
			name: item.name,
			value: item,
		};
	}

	onSelect(network: INetworkEnvironment): void {
		console.log('select', network);
		this.store.dispatch(NetworkAction.selectNetwork({network}));
	}
}
