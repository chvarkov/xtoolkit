import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ActionHistorySelector } from '../../store/action-history.selector';
import { ActionHistoryAction } from '../../store/action-history.action';
import { ActionHistoryElement } from '../../../core/data-provider/data-provider';
import { ProjectAction } from '../../../project/store/project.action';
import { txTabName } from '../../../core/helpers/tx-tab-name';

@Component({
	selector: 'app-action-list',
	templateUrl: './action-history-list.component.html',
	styleUrls: ['./action-history-list.component.scss']
})
export class ActionHistoryListComponent implements OnInit {
	actionHistory$: Observable<ActionHistoryElement[]>;

	@Output() resize: EventEmitter<number> = new EventEmitter<number>();

	constructor(private readonly store: Store) {
		this.actionHistory$ = this.store.select(ActionHistorySelector.list);
	}

	ngOnInit(): void {
		this.loadActionHistory();
	}

	loadActionHistory(): void {
		this.store.dispatch(ActionHistoryAction.loadActionHistory());
	}

	clearActionHistory(): void {
		this.store.dispatch(ActionHistoryAction.clearActionHistory());
	}

	openTx(elem: ActionHistoryElement): void {
		if (!elem.txHash) {
			return;
		}

		this.store.dispatch(ProjectAction.openProjectTab({
			componentType: 'tx',
			projectId: elem.projectId,
			componentId: elem.txHash,
			title: txTabName(elem.txHash),
		}));
	}
}
