import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ITokenPosition } from '../../../core/elrond/interfaces/token-position';
import { Store } from '@ngrx/store';
import { ProjectSelector } from '../../store/project.selector';
import { ProjectScAbi } from '../../../core/data-provider/data-provider';

@Component({
	selector: 'app-sc-element',
	templateUrl: './sc-element.component.html',
	styleUrls: ['./sc-element.component.scss']
})
export class ScElementComponent implements OnInit {
	@Input() address: string = '';
	@Input() data?: ProjectScAbi;

	positions$: Observable<ITokenPosition[]> = of([]);

	native$: Observable<string> = of('0');

	constructor(private readonly store: Store) {
	}

	ngOnInit(): void {
		this.positions$ = this.store.select(ProjectSelector.getTokenBalances(this.address));
		this.native$ = this.store.select(ProjectSelector.getNativeBalance(this.address));
	}
}
