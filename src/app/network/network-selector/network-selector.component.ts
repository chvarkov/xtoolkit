import { Component, OnInit } from '@angular/core';
import { DEFAULT_NETWORKS } from '../../core/constants';
import { INetworkEnvironment } from '../../core/interfaces/network-environment';
import { SelectElement } from '../../core/ui/select/select.component';

@Component({
	selector: 'app-network-selector',
	templateUrl: './network-selector.component.html',
	styleUrls: ['./network-selector.component.scss']
})
export class NetworkSelectorComponent implements OnInit {
	networks: INetworkEnvironment[] = DEFAULT_NETWORKS;

	default: INetworkEnvironment = this.networks[0];

	constructor() {
	}

	ngOnInit(): void {
	}

	mapElement(item: INetworkEnvironment): SelectElement<INetworkEnvironment> {
		return {
			name: item.name,
			value: item,
		};
	}
}
