import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../../../core/elrond/interfaces/network-environment';
import { ProjectAction } from '../../../project/store/project.action';
import { ProjectSelector } from '../../../project/store/project.selector';
import { filter, switchMap } from 'rxjs/operators';
import { NetworkSelector } from '../../../network/store/network.selector';
import { IElrondFullTransaction, ITxOperation } from '../../../core/elrond/interfaces/elrond-transaction';

@Component({
	selector: 'app-tx-viewer',
	templateUrl: './tx-viewer.component.html',
	styleUrls: ['./tx-viewer.component.scss']
})
export class TxViewerComponent implements OnInit {
	@Input() projectId: string = '';
	@Input() txHash: string = '';

	network$?: Observable<INetworkEnvironment | undefined>;

	tx$?: Observable<IElrondFullTransaction | undefined>;

	getTransferOperations(tx: IElrondFullTransaction): ITxOperation[] {
		return tx.operations?.filter(op => op.action === 'transfer') || [];
	}

	constructor(private readonly store: Store) {
	}

	ngOnInit(): void {
		this.network$ = this.store.select(ProjectSelector.activeProject()).pipe(
			switchMap((project) => this.store.select(NetworkSelector.networkByChainId(project?.chainId || ''))),
		);

		this.tx$ = this.store.select(ProjectSelector.tx(this.projectId, this.txHash)).pipe(filter(v => !!v));

		this.store.dispatch(ProjectAction.loadTransaction({projectId: this.projectId, txHash: this.txHash}));
	}

}
