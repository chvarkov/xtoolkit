import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { filter, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { ConnectMaiarWalletDialogComponent } from '../components/dialogs/connect-maiar-wallet-dialog/connect-maiar-wallet-dialog.component';
import { Store } from '@ngrx/store';
import { WalletConnector } from '../../core/elrond/services/wallet-connector';
import { MatDialog } from '@angular/material/dialog';
import { ProjectSelector } from '../store/project.selector';
import { NetworkSelector } from '../../network/store/network.selector';
import { ProjectAction } from '../store/project.action';
import { ProjectWallet, WalletSignStrategy } from '../../core/data-provider/data-provider';
import { SetMaiarWalletNameDialogComponent } from '../components/dialogs/set-maiar-wallet-name-dialog/set-maiar-wallet-name-dialog.component';

@Injectable({providedIn: 'root'})
export class MaiarWalletService {
	constructor(private readonly store: Store,
				private readonly walletConnector: WalletConnector,
				private readonly dialog: MatDialog) {
	}

	get activeMaiarWallet$(): Observable<ProjectWallet | undefined> {
		return this.walletConnector.activeAddress$.pipe(
			switchMap((address) => {
				if (address) {
					return this.store.select(ProjectSelector.walletByAddress(address));
				}

				return of(undefined);
			}),
		);
	}

	connectWallet(): Observable<string> {
		return of(undefined).pipe(
			switchMap(() => this.store.select(ProjectSelector.activeProject()).pipe(
				take(1),
				filter(v => !!v),
				switchMap((project) => this.store.select(NetworkSelector.networkByChainId(project?.chainId || '')).pipe(
					filter(network => !!network),
					mergeMap((network) => {
						const walletConnectBridgeAddress = network?.walletConnectBridgeAddresses?.[0];

						if (!walletConnectBridgeAddress) {
							return throwError(new Error(`Walled connect bridge address are not set for network (${network?.chainId})`));
						}

						return this.walletConnector.createLogin(walletConnectBridgeAddress);
					}),
					switchMap((walletLoginRef) => {
						const modalDialogRef = this.dialog.open(ConnectMaiarWalletDialogComponent, {data: walletLoginRef.connectUrl});

						return walletLoginRef.afterComplete$.pipe(
							tap(() => modalDialogRef.close()),
							filter(address => !!address),
							map(address => address || ''),
						);
					}),
					switchMap((address) => {
						if (project) {
							const wallets = project.wallets || [];

							const isExists = wallets.find(w => w.address === address);

							if (!isExists) {
								return this.dialog.open(SetMaiarWalletNameDialogComponent).afterClosed().pipe(
									map((walletName) => {
										this.store.dispatch(ProjectAction.addWallet({
											projectId: project.id,
											wallet: {
												name: walletName || 'Maiar wallet',
												address,
												signStrategy: WalletSignStrategy.MobileApp,
												mnemonic: [],
											},
										}));

										return address;
									})
								);
							}
						}

						return address;
					}),
					take(1),
				)),
			)),
		);
	}

	logout(): Observable<boolean> {
		return this.walletConnector.logout();
	}
}
