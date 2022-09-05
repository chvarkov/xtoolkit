import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ITokenPosition } from '../../../core/elrond/interfaces/token-position';
import { Observable, of } from 'rxjs';
import { ProjectSelector } from '../../store/project.selector';

@Component({
	selector: 'app-wallet-element',
	templateUrl: './wallet-element.component.html',
	styleUrls: ['./wallet-element.component.scss']
})
export class WalletElementComponent implements OnInit {
	@Input() name: string = '';
	@Input() address: string = '';

	positions$: Observable<ITokenPosition[]> = of([]);

	native$: Observable<string> = of('0');

	constructor(private readonly store: Store) {
	}

	ngOnInit(): void {
		this.positions$ = this.store.select(ProjectSelector.getTokenBalances(this.address));
		this.native$ = this.store.select(ProjectSelector.getNativeBalance(this.address));
	}

}
