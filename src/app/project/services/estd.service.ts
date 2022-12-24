import { Injectable } from '@angular/core';
import {
	ESDTInteractor,
	IFreezeUnFreezeOptions,
	IIssueTokenOptions,
	IMintTokenOptions
} from '../../core/elrond/services/estd-intercator';
import { INetworkEnvironment } from '../../core/elrond/interfaces/network-environment';
import {
	ActionHistoryElement,
	ActionStatus,
	ActionType,
	GeneratedWallet
} from '../../core/data-provider/data-provider';
import { Store } from '@ngrx/store';
import { ProjectAction } from '../store/project.action';
import { ActionHistoryAction } from '../../action-history/store/action-history.action';
import * as uuid from 'uuid';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EstdService {
	constructor(private readonly estdInteractor: ESDTInteractor,
				private readonly store: Store) {
	}

	issueFungibleToken(projectId: string,
					   network: INetworkEnvironment,
					   wallet: GeneratedWallet,
					   options: IIssueTokenOptions): Observable<void> {
		const txHash$ = from(this.estdInteractor.issueFungibleToken(network, wallet, options));

		return txHash$.pipe(
			map((txHash) => {
				const log: ActionHistoryElement = {
					id: uuid.v4(),
					txHash,
					projectId,
					type: ActionType.Issue,
					data: options,
					chainId: network.chainId,
					title: 'Issue token',
					status: ActionStatus.Pending,
					caller: wallet.address,
					timestamp: Date.now(),
				};

				this.store.dispatch(ProjectAction.addTokenIssueTxToWaitList({
					data: {
						projectId: projectId,
						txHash,
						actionId: log.id,
						chainId: network.chainId,
					},
				}));

				this.store.dispatch(ActionHistoryAction.logAction({ data: log }));
			}),
		);
	}

	mint(projectId: string,
		 network: INetworkEnvironment,
		 wallet: GeneratedWallet,
		 options: IMintTokenOptions): Observable<void> {
		const txHash$ = this.estdInteractor.mint(network, wallet, options);

		return from(txHash$).pipe(
			map((txHash) => {
				const log: ActionHistoryElement = {
					id: uuid.v4(),
					txHash,
					projectId: projectId,
					type: ActionType.Tx,
					data: options,
					chainId: network.chainId,
					title: `Mint token ${options.identifier}`,
					status: ActionStatus.Pending,
					caller: wallet.address,
					timestamp: Date.now(),
				};

				this.store.dispatch(ActionHistoryAction.logAction({ data: log }));
			}),
		);
	}

	pause(projectId: string,
		  network: INetworkEnvironment,
		  wallet: GeneratedWallet,
		  identifier: string): Observable<void> {
		const txHash$ = this.estdInteractor.pause(network, wallet, identifier);

		return from(txHash$).pipe(
			map((txHash) => {
				const log: ActionHistoryElement = {
					id: uuid.v4(),
					txHash,
					projectId: projectId,
					type: ActionType.Tx,
					data: { identifier },
					chainId: network.chainId,
					title: `Pause token ${identifier}`,
					status: ActionStatus.Pending,
					caller: wallet.address,
					timestamp: Date.now(),
				};

				this.store.dispatch(ActionHistoryAction.logAction({ data: log }));
			}),
		);
	}

	unPause(projectId: string,
		  	network: INetworkEnvironment,
		  	wallet: GeneratedWallet,
		  	identifier: string): Observable<void> {
		const txHash$ = this.estdInteractor.unPause(network, wallet, identifier);

		return from(txHash$).pipe(
			map((txHash) => {
				const log: ActionHistoryElement = {
					id: uuid.v4(),
					txHash,
					projectId: projectId,
					type: ActionType.Tx,
					data: { identifier },
					chainId: network.chainId,
					title: `Unpause token ${identifier}`,
					status: ActionStatus.Pending,
					caller: wallet.address,
					timestamp: Date.now(),
				};

				this.store.dispatch(ActionHistoryAction.logAction({ data: log }));
			}),
		);
	}

	freeze(projectId: string,
		   network: INetworkEnvironment,
		   wallet: GeneratedWallet,
		   options: IFreezeUnFreezeOptions): Observable<void> {
		const txHash$ = this.estdInteractor.freeze(network, wallet, options);

		return from(txHash$).pipe(
			map((txHash) => {
				const log: ActionHistoryElement = {
					id: uuid.v4(),
					txHash,
					projectId: projectId,
					type: ActionType.Tx,
					data: options ,
					chainId: network.chainId,
					title: `Freeze token ${options.identifier}`,
					status: ActionStatus.Pending,
					caller: wallet.address,
					timestamp: Date.now(),
				};

				this.store.dispatch(ActionHistoryAction.logAction({ data: log }));
			}),
		);
	}

	unFreeze(projectId: string,
			 network: INetworkEnvironment,
			 wallet: GeneratedWallet,
			 options: IFreezeUnFreezeOptions): Observable<void> {
		const txHash$ = this.estdInteractor.unFreeze(network, wallet, options);

		return from(txHash$).pipe(
			map((txHash) => {
				const log: ActionHistoryElement = {
					id: uuid.v4(),
					txHash,
					projectId: projectId,
					type: ActionType.Tx,
					data: options ,
					chainId: network.chainId,
					title: `Unfreeze token ${options.identifier}`,
					status: ActionStatus.Pending,
					caller: wallet.address,
					timestamp: Date.now(),
				};

				this.store.dispatch(ActionHistoryAction.logAction({ data: log }));
			}),
		);
	}
}
