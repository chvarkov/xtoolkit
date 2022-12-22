import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ProjectSelector } from '../../../project/store/project.selector';
import { ProjectAction } from '../../../project/store/project.action';
import { ITokenInfo } from '../../../core/elrond/interfaces/token-info';
import { ITokenHolder } from '../../../core/elrond/interfaces/token-holder';
import { ITokenRole } from '../../../core/elrond/interfaces/token-role';
import { ITokenTransfer } from '../../../core/elrond/interfaces/token-transfer';
import { filter, map, switchMap } from 'rxjs/operators';
import { INetworkEnvironment } from '../../../core/elrond/interfaces/network-environment';
import { NetworkSelector } from '../../../network/store/network.selector';

@Component({
	selector: 'app-token-viewer',
	templateUrl: './token-viewer.component.html',
	styleUrls: ['./token-viewer.component.scss']
})
export class TokenViewerComponent implements OnInit {
	@Input() identifier: string = '';
	@Input() projectId: string = '';

	token$?: Observable<ITokenInfo>;
	tokenHolders$?: Observable<ITokenHolder[]>;
	tokenRoles$?: Observable<ITokenRole[]>;
	tokenTransfers$?: Observable<ITokenTransfer[]>;
	network$?: Observable<INetworkEnvironment | undefined>;

	constructor(private readonly store: Store) {
	}

	ngOnInit(): void {
		this.token$ = this.store.select(ProjectSelector.token(this.identifier)).pipe(filter(v => !!v));
		this.tokenHolders$ = this.store.select(ProjectSelector.tokenHolders(this.identifier)).pipe(filter(v => !!v));
		this.tokenRoles$ = this.store.select(ProjectSelector.tokenRoles(this.identifier)).pipe(filter(v => !!v));
		this.tokenTransfers$ = this.store.select(ProjectSelector.tokenTransfers(this.identifier)).pipe(filter(v => !!v));
		this.network$ = this.store.select(ProjectSelector.activeProject()).pipe(
			map(project => project?.chainId || ''),
			switchMap((chainId) => this.store.select(NetworkSelector.networkByChainId(chainId))),
		);

		this.loadData();
	}

	explore(network: INetworkEnvironment): void {
		window.open(`${network.explorerUrl}/tokens/${this.identifier}`, '_blank');
	}

	delete(): void {
		this.store.dispatch(ProjectAction.deleteToken({projectId: this.projectId, identifier: this.identifier}));
	}

	loadData(): void {
		this.store.dispatch(ProjectAction.loadToken({projectId: this.projectId, identifier: this.identifier}));
		this.store.dispatch(ProjectAction.loadTokenHolders({projectId: this.projectId, identifier: this.identifier}));
		this.store.dispatch(ProjectAction.loadTokenRoles({projectId: this.projectId, identifier: this.identifier}));
		this.store.dispatch(ProjectAction.loadTokenTransfers({projectId: this.projectId, identifier: this.identifier}));
	}
}
