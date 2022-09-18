import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ActionHistorySelector } from '../../store/action-history.selector';
import { ActionHistoryAction } from '../../store/action-history.action';
import { ActionHistoryElement } from '../../../core/data-provider/data-provider';

@Component({
	selector: 'app-action-list',
	templateUrl: './action-history-list.component.html',
	styleUrls: ['./action-history-list.component.scss']
})
export class ActionHistoryListComponent implements OnInit {
	actionHistory$: Observable<ActionHistoryElement[]>;

	constructor(private readonly store: Store) {
		this.actionHistory$ = this.store.select(ActionHistorySelector.list);
	}

	ngOnInit(): void {
		this.store.dispatch(ActionHistoryAction.loadActionHistory());
	}
}
