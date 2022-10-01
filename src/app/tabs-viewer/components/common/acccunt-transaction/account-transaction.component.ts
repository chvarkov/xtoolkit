import { Component, Input, OnInit } from '@angular/core';
import { IElrondTransaction } from '../../../../core/elrond/interfaces/elrond-transaction';
import { Store } from '@ngrx/store';
import { ProjectAction } from '../../../../project/store/project.action';
import { txTabName } from '../../../../core/helpers/tx-tab-name';

@Component({
	selector: 'app-account-transaction',
	templateUrl: './account-transaction.component.html',
	styleUrls: ['./account-transaction.component.scss']
})
export class AccountTransactionComponent implements OnInit {
	@Input() projectId = '';
	@Input() tx?: IElrondTransaction;

	@Input() chainId: string = '';

	constructor(private readonly store: Store) {
	}

	ngOnInit(): void {
	}

	openTx(): void {
		if (!this.tx) {
			return;
		}

		this.store.dispatch(ProjectAction.openProjectTab({
			projectId: this.projectId,
			componentId: this.tx.txHash,
			title: txTabName(this.tx.txHash),
			componentType: 'tx',
		}));
	}
}
