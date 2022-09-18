import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { INetworkEnvironment } from '../../../core/elrond/interfaces/network-environment';
import { ProjectScAbi } from '../../../core/data-provider/data-provider';
import { Store } from '@ngrx/store';
import { ProjectAction } from '../../../project/store/project.action';
import { Observable, of, Subscription } from 'rxjs';
import { ProjectSelector } from '../../../project/store/project.selector';
import { IGeneratedWallet } from '../../../project/components/dialogs/generate-wallet-dialog/generate-wallet-dialog.component';
import { AccountOnNetwork } from '@elrondnetwork/erdjs-network-providers/out';
import { IElrondTransaction } from '../../../core/elrond/interfaces/elrond-transaction';
import { ITokenPosition } from '../../../core/elrond/interfaces/token-position';

@Component({
	selector: 'app-sc-viewer',
	templateUrl: './sc-viewer.component.html',
	styleUrls: ['./sc-viewer.component.scss'],
})
export class ScViewerComponent implements OnInit, OnDestroy {
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
		const address = this.projectSc?.address || '';

		this.account$ = this.store.select(ProjectSelector.account(this.projectSc?.id || '', address));
		this.transactions$ = this.store.select(ProjectSelector.accountTransactions(projectId, address));
		this.tokens$ = this.store.select(ProjectSelector.accountTokens(projectId, address));
		this.native$ = this.store.select(ProjectSelector.accountNativeAmount(projectId, address));

		this.wallets$ = this.store.select(ProjectSelector.walletsByProjectId(this.projectSc?.projectId || ''));

		this.store.dispatch(ProjectAction.loadAccountAndPositions({projectId, address}));
		this.store.dispatch(ProjectAction.loadAccountTransactions({projectId, address}));
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}
}
