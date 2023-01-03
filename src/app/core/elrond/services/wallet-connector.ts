import { Injectable } from '@angular/core';
import { WalletConnectProvider } from '@elrondnetwork/erdjs-wallet-connect-provider/out';
import { Observable, Subject } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { DEFAULT_WALLET_CONNECT_BRIDGE_URL } from '../../constants';

export class WalletLoginRef {
	constructor(public readonly connectUrl: string,
				private readonly login$: Observable<string | undefined>) {
	}

	get afterComplete$(): Observable<string | undefined> {
		return this.login$.pipe(
			take(1),
		);
	}

	get afterLogin$(): Observable<string> {
		return this.afterComplete$.pipe(
			filter(address => !!address),
		) as Observable<string>;
	}

	get afterLogout$(): Observable<void> {
		return this.afterComplete$.pipe(
			filter(address => !address),
			map(() => undefined),
		);
	}
}

@Injectable({providedIn: 'root'})
export class WalletConnector {
	private readonly activeAddressSubject = new Subject<string | undefined>();

	private provider: WalletConnectProvider = new WalletConnectProvider(DEFAULT_WALLET_CONNECT_BRIDGE_URL, {
		onClientLogin: () => null,
		onClientLogout: () => null,
	});

	get activeAddress$(): Observable<string | undefined> {
		return this.activeAddressSubject.asObservable();
	}

	createLogin(walletConnectBridge: string): Observable<WalletLoginRef> {
		this.provider = new WalletConnectProvider(walletConnectBridge, {
			onClientLogin: () => {
				this.activeAddressSubject.next(this.provider.address);
			},
			onClientLogout: () => {
				this.activeAddressSubject.next(undefined);
			},
		});

	 	return fromPromise(this.provider.init()).pipe(
			switchMap(() => fromPromise(this.provider.login())),
			map(connectUrl => new WalletLoginRef(connectUrl, this.activeAddressSubject.asObservable())),
		);
	}

	logout(): Observable<boolean> {
		return fromPromise(this.provider.logout());
	}
}
