import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ActionStatus, PendingTokenIssue } from '../../core/data-provider/data-provider';
import { ProjectSelector } from '../store/project.selector';
import { NetworkSelector } from '../../network/store/network.selector';
import { take } from 'rxjs/operators';
import { ITransactionOnNetwork, TransactionHash, TransactionWatcher } from '@elrondnetwork/erdjs/out';
import { ActionHistoryAction } from '../../action-history/store/action-history.action';
import { ElrondProxyProvider } from '../../core/elrond/services/elrond-proxy-provider';
import { ProjectAction } from '../store/project.action';
import { ElrondDataProvider } from '../../core/elrond/elrond.data-provider';

@Injectable({providedIn: 'root'})
export class TokenIssueAwaiter {
	private readonly watcherMap: Map<string, TransactionWatcher> = new Map<string, TransactionWatcher>();
	private readonly waitList$: Observable<PendingTokenIssue[]>;
	private readonly sub = new Subscription();

	constructor(private readonly store: Store,
				private readonly proxyProvider: ElrondProxyProvider,
				private readonly elrondDataProvider: ElrondDataProvider) {
		this.waitList$ = this.store.select(ProjectSelector.issueTokenWaitList);
	}

	enable(): void {
		this.sub.add(
			this.waitList$.subscribe(async waitList => {
				for (const pendingTokenTx of waitList) {
					if (this.watcherMap.has(pendingTokenTx.txHash)) {
						continue;
					}

					await this.pushToWatch(pendingTokenTx);
				}
			}),
		);
	}

	async pushToWatch(data: PendingTokenIssue): Promise<void> {
		const network = await this.store.select(NetworkSelector.networkByChainId(data.chainId))
			.pipe(
				take(1),
			)
			.toPromise();

		if (network) {
			const proxy = this.proxyProvider.getProxy(network)

			setTimeout(async () => {
				const tx = await proxy.getTransaction(data?.txHash || '');

				const watcher = new TransactionWatcher({
					getTransaction(txHash: string): Promise<ITransactionOnNetwork> {
						return proxy.getTransaction(txHash);
					},
				}, 3000);

				watcher.awaitOnCondition({
					...tx,
					getHash(): TransactionHash {
						return new TransactionHash(tx.hash);
					},
				}, (tx) => {
					return tx.status.isFailed() || tx.status.isExecuted() || tx.status.isInvalid();
				})
					.then(async (tx) => {
						const status = tx.status.isExecuted() ? ActionStatus.Success : ActionStatus.Fail;

						switch (status) {
							case ActionStatus.Success:
								const identifier = await this.elrondDataProvider.getTransaction(network, tx.hash)
									.toPromise()
									.then((res: any) => res.operations[0].identifier);

								this.store.dispatch(ProjectAction.addToken({
									projectId: data.projectId,
									identifier,
								}));

								this.store.dispatch(ActionHistoryAction.updateActionStatus({
									id: data.actionId,
									status,
								}));

								break;

							case ActionStatus.Fail:
								this.store.dispatch(ActionHistoryAction.updateActionStatus({
									id: data.actionId,
									status,
								}));

								this.store.dispatch(ProjectAction.deleteTokenIssueTxFromWaitList({
									txHash: data.txHash,
								}));
								break;
						}

						this.store.dispatch(ProjectAction.deleteTokenIssueTxFromWaitList({
							txHash: data.txHash,
						}));

						this.watcherMap.delete(data.txHash);
					});
			}, 2_500);
		}
	}

	disable(): void {
		this.sub.unsubscribe();
	}
}
