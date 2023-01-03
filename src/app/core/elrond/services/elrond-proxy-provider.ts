import { INetworkEnvironment } from '../interfaces/network-environment';
import { ProxyNetworkProvider } from '@elrondnetwork/erdjs-network-providers/out';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ElrondProxyProvider {
	getProxy(network: INetworkEnvironment): ProxyNetworkProvider {
		return new ProxyNetworkProvider(network.apiUrl);
	}
}
