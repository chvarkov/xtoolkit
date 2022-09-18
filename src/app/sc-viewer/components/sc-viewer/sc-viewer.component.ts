import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { INetworkEnvironment } from '../../../core/elrond/interfaces/network-environment';
import { ProjectScAbi } from '../../../core/data-provider/data-provider';
import { Store } from '@ngrx/store';
import { ProjectAction } from '../../../project/store/project.action';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { ProjectSelector } from '../../../project/store/project.selector';
import { IGeneratedWallet } from '../../../project/components/dialogs/generate-wallet-dialog/generate-wallet-dialog.component';
import { NetworkSelector } from '../../../network/store/network.selector';
import { filter, map } from 'rxjs/operators';
import { AccountOnNetwork } from '@elrondnetwork/erdjs-network-providers/out';
import { IElrondTransaction } from '../../../core/elrond/interfaces/elrond-transaction';
import { ITokenPosition } from '../../../core/elrond/interfaces/token-position';

@Component({
	selector: 'app-sc-viewer',
	templateUrl: './sc-viewer.component.html',
	styleUrls: ['./sc-viewer.component.scss'],
})
export class ScViewerComponent implements OnInit, OnDestroy {
	@Input() address = 'erd12ydefajqyc5fh9kzjrr4k8064j985k5qxqty7xdzfaq7ysy05pkqkpypyj'; // TODO: rework sc addresses

	address$: Observable<string> = of('');

	@Input() selectedEnvironment?: INetworkEnvironment;

	@Input() projectSc?: ProjectScAbi | null;

	account$?: Observable<AccountOnNetwork>;
	transactions$?: Observable<IElrondTransaction[]>;
	tokens$?: Observable<ITokenPosition[]>;
	native$?: Observable<string>;

	code$: Observable<string> = of('');

	wallets$: Observable<IGeneratedWallet[]> = of([]);

	private readonly sub = new Subscription();

	constructor(private readonly store: Store) {
	}

	ngOnInit(): void {
		const projectId = this.projectSc?.id || '';
		this.account$ = this.store.select(ProjectSelector.account(this.projectSc?.id || '', this.address));
		this.transactions$ = this.store.select(ProjectSelector.accountTransactions(projectId, this.address));
		this.tokens$ = this.store.select(ProjectSelector.accountTokens(projectId, this.address));
		this.native$ = this.store.select(ProjectSelector.accountNativeAmount(projectId, this.address));

		this.address$ = combineLatest([
			this.store.select(ProjectSelector.addressesMapByScId(this.projectSc?.id || '')),
			this.store.select(NetworkSelector.selectedNetwork),
		]).pipe(
			map(([map, network]) => map[network.chainId] || ''),
		);

		this.wallets$ = this.store.select(ProjectSelector.walletsByProjectId(this.projectSc?.projectId || ''));

		this.sub.add(this.address$.subscribe(address => {
			if (!address) {
				return;
			}

			this.code$ = this.store.select(ProjectSelector.getScCode(address));
			this.store.dispatch(ProjectAction.loadScCode({address}));
		}));

		this.store.dispatch(ProjectAction.loadAccountAndPositions({projectId, address: this.address}));
		this.store.dispatch(ProjectAction.loadAccountTransactions({projectId, address: this.address}));
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}
}
