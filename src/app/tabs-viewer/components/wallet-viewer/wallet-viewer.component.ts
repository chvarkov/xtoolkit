import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProjectAction } from '../../../project/store/project.action';
import { Observable } from 'rxjs';
import { AccountOnNetwork } from '@elrondnetwork/erdjs-network-providers/out';
import { ProjectSelector } from '../../../project/store/project.selector';
import { IElrondTransaction } from '../../../core/elrond/interfaces/elrond-transaction';
import { ITokenPosition } from '../../../core/elrond/interfaces/token-position';
import { filter, map } from 'rxjs/operators';
import { GeneratedWallet } from '../../../core/data-provider/data-provider';
import { Account, Address } from '@elrondnetwork/erdjs/out';
import { FaucetService } from '../../../core/services/faucet.service';
import { INft } from '../../../core/elrond/services/nft';

@Component({
	selector: 'app-wallet-viewer',
	templateUrl: './wallet-viewer.component.html',
	styleUrls: ['./wallet-viewer.component.scss']
})
export class WalletViewerComponent implements OnInit {
	@Input() projectId: string = '';
	@Input() address: string = '';

	account$?: Observable<AccountOnNetwork>;
	transactions$?: Observable<IElrondTransaction[]>;
	tokens$?: Observable<ITokenPosition[]>;
	nfts$?: Observable<INft[]>;
	native$?: Observable<string>;
	chainId$?: Observable<string>;
	wallet$?: Observable<GeneratedWallet | undefined>;

	constructor(private readonly store: Store,
				public readonly faucet: FaucetService) {
	}

	ngOnInit(): void {
		this.account$ = this.store.select(ProjectSelector.account(this.address)).pipe(
			map(acc => acc || new Account(new Address(this.address))),
		);
		this.transactions$ = this.store.select(ProjectSelector.accountTransactions(this.address)).pipe(filter(v => !!v));
		this.tokens$ = this.store.select(ProjectSelector.accountTokens(this.address)).pipe(filter(v => !!v));
		this.nfts$ = this.store.select(ProjectSelector.accountNfts(this.address)).pipe(filter(v => !!v));
		this.native$ = this.store.select(ProjectSelector.accountNativeAmount(this.address)).pipe(filter(v => !!v));
		this.chainId$ = this.store.select(ProjectSelector.activeProject()).pipe(
			map((project) => project?.chainId || ''),
		);

		this.wallet$ = this.store.select(ProjectSelector.wallets()).pipe(
			map(wallets => wallets.find(w => w.address === w.address)),
		);

		this.loadData();
	}

	loadData(): void {
		console.log('emit load data : ' + this.address);
		this.store.dispatch(ProjectAction.loadAccountAndPositions({projectId: this.projectId, address: this.address}));
		this.store.dispatch(ProjectAction.loadAccountTransactions({projectId: this.projectId, address: this.address}));
		this.store.dispatch(ProjectAction.loadAccountNfts({projectId: this.projectId, address: this.address}));
	}

	renameWallet(name: string): void {
		this.store.dispatch(ProjectAction.renameWallet({projectId: this.projectId, address: this.address, name}));
	}

	exportMnemonic(wallet: GeneratedWallet): void {
		this.store.dispatch(ProjectAction.exportMnemonic({wallet}));
	}

	deleteWallet(wallet: GeneratedWallet): void {
		this.store.dispatch(ProjectAction.deleteWallet({projectId: this.projectId, address: wallet.address}));
	}
}
