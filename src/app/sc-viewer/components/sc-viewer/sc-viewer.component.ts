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

@Component({
	selector: 'app-sc-viewer',
	templateUrl: './sc-viewer.component.html',
	styleUrls: ['./sc-viewer.component.scss'],
})
export class ScViewerComponent implements OnInit, OnDestroy {
	address$: Observable<string> = of('');

	@Input() selectedEnvironment?: INetworkEnvironment;

	@Input() projectSc?: ProjectScAbi | null;

	code$: Observable<string> = of('');

	wallets$: Observable<IGeneratedWallet[]> = of([]);

	private readonly sub = new Subscription();

	constructor(private readonly store: Store) {
	}

	ngOnInit(): void {
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
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}
}
