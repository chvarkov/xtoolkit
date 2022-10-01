import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../../../core/elrond/interfaces/network-environment';
import { ProjectAction } from '../../../project/store/project.action';
import { ProjectSelector } from '../../../project/store/project.selector';
import { switchMap } from 'rxjs/operators';
import { NetworkSelector } from '../../../network/store/network.selector';
import { IElrondTransaction } from '../../../core/elrond/interfaces/elrond-transaction';

@Component({
	selector: 'app-tx-viewer',
	templateUrl: './tx-viewer.component.html',
	styleUrls: ['./tx-viewer.component.scss']
})
export class TxViewerComponent implements OnInit {
	@Input() projectId: string = '';
	@Input() txHash: string = '';

	network$?: Observable<INetworkEnvironment | undefined>;

	tx$?: Observable<IElrondTransaction | undefined>;

	constructor(private readonly store: Store) {
	}

	ngOnInit(): void {
		this.network$ = this.store.select(ProjectSelector.projectById(this.projectId)).pipe(
			switchMap((project) => this.store.select(NetworkSelector.networkByChainId(project?.chainId || ''))),
		);

		this.tx$ = this.store.select(ProjectSelector.tx(this.projectId, this.txHash));

		this.store.dispatch(ProjectAction.loadTransaction({projectId: this.projectId, txHash: this.txHash}));
	}

}
