import { Component, Input, OnInit } from '@angular/core';
import { ITokenPosition } from '../../../../core/elrond/interfaces/token-position';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { ProjectSelector } from '../../../../project/store/project.selector';
import { ProjectAction } from '../../../../project/store/project.action';

@Component({
	selector: 'app-sc-tokens',
	templateUrl: './sc-tokens.component.html',
	styleUrls: ['./sc-tokens.component.scss']
})
export class ScTokensComponent implements OnInit {
	@Input() address: string = '';

	positions$: Observable<ITokenPosition[]> = of([]);

	native$: Observable<string> = of('0');

	constructor(private readonly store: Store) {
	}

	ngOnInit(): void {
		this.positions$ = this.store.select(ProjectSelector.getTokenBalances(this.address));
		this.native$ = this.store.select(ProjectSelector.getNativeBalance(this.address));

		this.store.dispatch(ProjectAction.loadPositions({address: this.address}));
	}

}
