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
import { parseTxStatus } from '../../core/elrond/helpers/parse-tx-status';
import { TransactionStatus } from '../../core/elrond/enums/transaction-status';

@Injectable({providedIn: 'root'})
export class TokenIssueAwaiter {
	private readonly watcherMap: Map<string, TransactionWatcher> = new Map<string, TransactionWatcher>();
	private readonly waitList$: Observable<PendingTokenIssue[]>;
	private readonly sub = new Subscription();

	constructor(private readonly store: Store,
				private readonly proxyProvider: ElrondProxyProvider) {
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
				}, 3000, 180_000);

				watcher.awaitCompleted({
					...tx,
					getHash(): TransactionHash {
						return new TransactionHash(tx.hash);
					},
				})
					.then(async (tx) => {
						const status = parseTxStatus(tx) === TransactionStatus.Success
							? ActionStatus.Success
							: ActionStatus.Fail;

						switch (status) {
							case ActionStatus.Success:
								const identifier = this.parseIssuedTokenIdentifier(tx);

								if (!identifier) {
									return;
								}

								this.store.dispatch(ProjectAction.addToken({
									projectId: data.projectId,
									identifier,
								}));

								this.store.dispatch(ActionHistoryAction.updateActionStatus({
									projectId: data.projectId,
									id: data.actionId,
									status,
								}));

								break;

							case ActionStatus.Fail:
								this.store.dispatch(ActionHistoryAction.updateActionStatus({
									projectId: data.projectId,
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

	private parseIssuedTokenIdentifier(tx: ITransactionOnNetwork): string | undefined {
		const event = tx.logs.findFirstOrNoneEvent('issue');

		if (!event) {
			return;
		}

		const firstTopic = event.topics[0];

		if (!firstTopic) {
			return;
		}

		return Buffer.from(firstTopic.hex(), 'hex').toString('utf8');
	}
}
