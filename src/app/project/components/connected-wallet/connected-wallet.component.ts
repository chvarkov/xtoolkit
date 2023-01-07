import { Component, Input, OnInit } from '@angular/core';
import { ProjectWallet } from '../../../core/data-provider/data-provider';
import { ProjectAction } from '../../store/project.action';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-connected-wallet',
	templateUrl: './connected-wallet.component.html',
	styleUrls: ['./connected-wallet.component.scss']
})
export class ConnectedWalletComponent implements OnInit {
	@Input() connectedWallet?: ProjectWallet;

	constructor(private readonly store: Store) {
	}

	ngOnInit(): void {
	}

	disconnectWallet(): void {
		this.store.dispatch(ProjectAction.logoutMaiarWallet());
	}
}
