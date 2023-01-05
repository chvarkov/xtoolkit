import { Component, Input, OnInit } from '@angular/core';
import { ActionHistoryElement, ActionStatus, ActionType } from '../../../core/data-provider/data-provider';
import { ITransactionOnNetwork, TransactionHash, TransactionWatcher } from '@elrondnetwork/erdjs/out';
import { ElrondProxyProvider } from '../../../core/elrond/services/elrond-proxy-provider';
import { Store } from '@ngrx/store';
import { NetworkSelector } from '../../../network/store/network.selector';
import { take } from 'rxjs/operators';
import { ActionHistoryAction } from '../../store/action-history.action';
import { ProjectAction } from '../../../project/store/project.action';
import { txTabName } from '../../../core/helpers/tx-tab-name';
import { parseTxStatus } from '../../../core/elrond/helpers/parse-tx-status';
import { TransactionStatus } from '../../../core/elrond/enums/transaction-status';

@Component({
	selector: 'app-action',
	templateUrl: './action.component.html',
	styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
	@Input() data?: ActionHistoryElement;

	isExpanded = false;

	private transactionWatcher?: TransactionWatcher;

	constructor(private readonly proxy: ElrondProxyProvider,
				private readonly store: Store) {
	}

	get keys(): string[] {
		return Object.keys(this.data?.data || {});
	}

	async ngOnInit(): Promise<void> {
		if (this.data && this.isPendingTx()) {
			const network = await this.store.select(NetworkSelector.networkByChainId(this.data.chainId))
				.pipe(
					take(1),
				)
				.toPromise();

			if (network) {
				const proxy = this.proxy.getProxy(network)

				setTimeout(async () => {
					const tx = await proxy.getTransaction(this.data?.txHash || '');

					this.transactionWatcher = new TransactionWatcher({
						getTransaction(txHash: string): Promise<ITransactionOnNetwork> {
							return proxy.getTransaction(txHash);
						},
					}, 3000);

					this.transactionWatcher.awaitCompleted({
						...tx,
						getHash(): TransactionHash {
							return new TransactionHash(tx.hash);
						},
					})
						.then((tx) => {
							const status = parseTxStatus(tx) === TransactionStatus.Success
								? ActionStatus.Success
								: ActionStatus.Fail;

							this.store.dispatch(ActionHistoryAction.updateActionStatus({
								projectId: this.data?.projectId || '',
								id: this.data?.id || '',
								status,
							}));
						});
				}, 2_500);
			}
		}
	}

	isPendingTx(): boolean {
		return !!(this.data
			&& this.data.type === ActionType.Tx
			&& this.data.status === ActionStatus.Pending
			&& !!this.data.txHash);
	}

	openTx(): void {
		if (!this.data || !this.data.txHash) {
			return;
		}
		this.store.dispatch(ProjectAction.openProjectTab({
			componentId: this.data.txHash,
			componentType: 'tx',
			title: txTabName(this.data.txHash),
		}));
	}

	toggleExpand(): void {
		this.isExpanded = !this.isExpanded;
	}
}
