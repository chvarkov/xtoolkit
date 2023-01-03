import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ProjectWallet, ProjectAbi, ProjectSmartContract } from '../../../core/data-provider/data-provider';
import { Store } from '@ngrx/store';
import { ProjectAction } from '../../../project/store/project.action';
import { Observable, of } from 'rxjs';
import { ProjectSelector } from '../../../project/store/project.selector';
import { AccountOnNetwork } from '@elrondnetwork/erdjs-network-providers/out';
import { IElrondTransaction } from '../../../core/elrond/interfaces/elrond-transaction';
import { ITokenPosition } from '../../../core/elrond/interfaces/token-position';
import { ScEndpointComponent } from './sc-endpoint/sc-endpoint.component';
import { filter } from 'rxjs/operators';
import { INft } from '../../../core/elrond/interfaces/nft';

@Component({
	selector: 'app-sc-viewer',
	templateUrl: './sc-viewer.component.html',
	styleUrls: ['./sc-viewer.component.scss'],
})
export class ScViewerComponent implements OnInit {
	readonly TABS = {
		Endpoints: 0,
		Tokens: 1,
		NFTs: 2,
		Code: 3,
	};

	@Input() projectId: string = '';
	@Input() chainId: string = '';

	@Input() abi?: ProjectAbi | null;

	@Input() sc?: ProjectSmartContract | null;

	@ViewChildren(ScEndpointComponent) private readonly endpointList?: QueryList<ScEndpointComponent>;

	account$?: Observable<AccountOnNetwork>;
	transactions$?: Observable<IElrondTransaction[]>;
	tokens$?: Observable<ITokenPosition[]>;
	nfts$?: Observable<INft[]>;
	native$?: Observable<string>;

	code$: Observable<string> = of('');

	wallets$: Observable<ProjectWallet[]> = of([]);

	openedTab = this.TABS.Endpoints;

	constructor(private readonly store: Store) {
	}

	ngOnInit(): void {
		const projectId = this.abi?.projectId || '';
		const address = this.sc?.address || '';

		if (address) {
			this.account$ = this.store.select(ProjectSelector.account(address));
			this.transactions$ = this.store.select(ProjectSelector.accountTransactions(address));
			this.tokens$ = this.store.select(ProjectSelector.accountTokens(address));
			this.native$ = this.store.select(ProjectSelector.accountNativeAmount(address));
			this.nfts$ = this.store.select(ProjectSelector.accountNfts(address));
			this.code$ = this.store.select(ProjectSelector.smartContractCode(address)).pipe(filter(v => !!v));

			this.store.dispatch(ProjectAction.loadAccountAndPositions({projectId, address}));
			this.store.dispatch(ProjectAction.loadAccountTransactions({projectId, address}));
			this.store.dispatch(ProjectAction.loadAccountNfts({projectId, address}));
		}

		this.wallets$ = this.store.select(ProjectSelector.wallets());
	}

	expandAll(): void {
		this.endpointList?.forEach(endpoint => endpoint.show());
	}

	hideAll(): void {
		this.endpointList?.forEach(endpoint => endpoint.hide());
	}
}
