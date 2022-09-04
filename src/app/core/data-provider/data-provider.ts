import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../interfaces/network-environment';

export const DATA_PROVIDER = 'CORE:DATA_PROVIDER';

export interface NetworkInfo {
	selected: INetworkEnvironment;
	list: INetworkEnvironment[];
}

export interface DataProvider {
	getNetworks(): Observable<NetworkInfo>;

	selectNetwork(network: INetworkEnvironment): Observable<void>
}
