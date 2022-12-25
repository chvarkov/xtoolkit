import { Injectable } from '@angular/core';
import {
	ESDTInteractor,
	IFreezeUnFreezeOptions,
	IIssueTokenOptions,
	IMintBurnTokenOptions, ISetSpecialRolesOptions, ITransferOwnershipOptions, IWipeOptions
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
import { ITokenTransferOptions, WalletManager } from '../../core/elrond/services/wallet.manager';

@Injectable({ providedIn: 'root' })
export class EstdService {
	constructor(private readonly estdInteractor: ESDTInteractor,
				private readonly walletManager: WalletManager,
				private readonly store: Store) {
	}

	transferFunds(projectId: string,
				  network: INetworkEnvironment,
				  options: ITokenTransferOptions): Observable<void> {
		const txHash$ = from(this.walletManager.transferFunds(network, options.wallet, options));

		return txHash$.pipe(
			map((txHash) => {
				const log: ActionHistoryElement = {
					id: uuid.v4(),
					txHash,
					projectId,
					type: ActionType.Tx,
					data: options,
					chainId: network.chainId,
					title: `Transfer ${options.amount.toString()} ${options.identifier}`,
					status: ActionStatus.Pending,
					caller: options.sender,
					timestamp: Date.now(),
				};

				this.store.dispatch(ActionHistoryAction.logAction({ data: log }));
			}),
		);
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
		 options: IMintBurnTokenOptions): Observable<void> {
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

	burn(projectId: string,
		 network: INetworkEnvironment,
		 wallet: GeneratedWallet,
		 options: IMintBurnTokenOptions): Observable<void> {
		const txHash$ = this.estdInteractor.burn(network, wallet, options);

		return from(txHash$).pipe(
			map((txHash) => {
				const log: ActionHistoryElement = {
					id: uuid.v4(),
					txHash,
					projectId: projectId,
					type: ActionType.Tx,
					data: options,
					chainId: network.chainId,
					title: `Burn token ${options.identifier}`,
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

	wipe(projectId: string,
		 network: INetworkEnvironment,
		 wallet: GeneratedWallet,
		 options: IWipeOptions): Observable<void> {
		const txHash$ = this.estdInteractor.wipe(network, wallet, options);

		return from(txHash$).pipe(
			map((txHash) => {
				const log: ActionHistoryElement = {
					id: uuid.v4(),
					txHash,
					projectId: projectId,
					type: ActionType.Tx,
					data: options ,
					chainId: network.chainId,
					title: `Wipe token ${options.identifier}`,
					status: ActionStatus.Pending,
					caller: wallet.address,
					timestamp: Date.now(),
				};

				this.store.dispatch(ActionHistoryAction.logAction({ data: log }));
			}),
		);
	}

	setSpecialRoles(projectId: string,
		 			network: INetworkEnvironment,
		 			wallet: GeneratedWallet,
		 			options: ISetSpecialRolesOptions): Observable<void> {
		const txHash$ = this.estdInteractor.setSpecialRoles(network, wallet, options);

		return from(txHash$).pipe(
			map((txHash) => {
				const log: ActionHistoryElement = {
					id: uuid.v4(),
					txHash,
					projectId: projectId,
					type: ActionType.Tx,
					data: options ,
					chainId: network.chainId,
					title: `Set token special role ${options.identifier}`,
					status: ActionStatus.Pending,
					caller: wallet.address,
					timestamp: Date.now(),
				};

				this.store.dispatch(ActionHistoryAction.logAction({ data: log }));
			}),
		);
	}

	transferOwnership(projectId: string,
					  network: INetworkEnvironment,
					  wallet: GeneratedWallet,
					  options: ITransferOwnershipOptions): Observable<void> {
		const txHash$ = this.estdInteractor.transferOwnership(network, wallet, options);

		return from(txHash$).pipe(
			map((txHash) => {
				const log: ActionHistoryElement = {
					id: uuid.v4(),
					txHash,
					projectId: projectId,
					type: ActionType.Tx,
					data: options ,
					chainId: network.chainId,
					title: `Transfer ownership ${options.identifier}`,
					status: ActionStatus.Pending,
					caller: wallet.address,
					timestamp: Date.now(),
				};

				this.store.dispatch(ActionHistoryAction.logAction({ data: log }));
			}),
		);
	}
}
