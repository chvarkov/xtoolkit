import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GeneratedWallet } from '../../../core/data-provider/data-provider';
import { ProjectSelector } from '../../store/project.selector';

@Component({
	selector: 'app-wallet-list',
	templateUrl: './wallet-list.component.html',
	styleUrls: ['./wallet-list.component.scss']
})
export class WalletListComponent implements OnInit {
	wallets$: Observable<GeneratedWallet[]>;

	constructor(private readonly store: Store) {
		this.wallets$ = this.store.select(ProjectSelector.walletsOfSelectedProject);
	}

	ngOnInit(): void {
	}

}
