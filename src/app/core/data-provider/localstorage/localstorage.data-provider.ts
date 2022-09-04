import { DataProvider } from '../data-provider';
import { Observable, of } from 'rxjs';
import { DEFAULT_NETWORKS } from '../../constants';
import { Injectable } from '@angular/core';
import { NetworkInfo } from '../data-provider';
import { INetworkEnvironment } from '../../interfaces/network-environment';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class LocalstorageDataProvider implements DataProvider {
	private readonly globalPrefix = 'elrond-sc';
	private readonly networksKey = `${this.globalPrefix}.networks`;

	getNetworks(): Observable<NetworkInfo> {
		const networks: NetworkInfo | null = this.get(this.networksKey);

		if (!networks) {
			const defaultNetworkInfo: NetworkInfo = {
				list: DEFAULT_NETWORKS,
				selected: DEFAULT_NETWORKS[0],
			};

			this.set(this.networksKey, defaultNetworkInfo);

			return of(defaultNetworkInfo);
		}

		return of(networks);
	}

	selectNetwork(network: INetworkEnvironment): Observable<void> {
		return this.getNetworks()
			.pipe(
				map((info => {
					info.selected = network;
					this.set(this.networksKey, info);
				})),
			);
	}

	private set<T>(key: string, value: T): void {
		return localStorage.setItem(key, JSON.stringify(value));
	}

	private get<T>(key: string): T {
		return JSON.parse(localStorage.getItem(key) || 'null');
	}
}
