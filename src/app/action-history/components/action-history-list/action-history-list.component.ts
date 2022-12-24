import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ActionHistorySelector } from '../../store/action-history.selector';
import { ActionHistoryAction } from '../../store/action-history.action';
import { ActionHistoryElement } from '../../../core/data-provider/data-provider';
import { ProjectAction } from '../../../project/store/project.action';
import { txTabName } from '../../../core/helpers/tx-tab-name';
import { filter } from 'rxjs/operators';
import { ProjectSelector } from '../../../project/store/project.selector';

@Component({
	selector: 'app-action-list',
	templateUrl: './action-history-list.component.html',
	styleUrls: ['./action-history-list.component.scss']
})
export class ActionHistoryListComponent implements OnInit {
	actionHistory$: Observable<ActionHistoryElement[]>;
	activeProjectId$: Observable<string | undefined>;

	@Output() resize: EventEmitter<number> = new EventEmitter<number>();

	constructor(private readonly store: Store) {
		this.actionHistory$ = this.store.select(ActionHistorySelector.list);
		this.activeProjectId$ = this.store.select(ProjectSelector.activeProjectId);
	}

	ngOnInit(): void {
		this.activeProjectId$.pipe(filter(v => !!v)).subscribe(projectId => this.loadActionHistory(projectId));

	}

	loadActionHistory(projectId?: string): void {
		if (!projectId) {
			return;
		}
		this.store.dispatch(ActionHistoryAction.loadActionHistory({projectId}));
	}

	clearActionHistory(projectId?: string): void {
		if (!projectId) {
			return;
		}
		this.store.dispatch(ActionHistoryAction.clearActionHistory({ projectId }));
	}

	openTx(elem: ActionHistoryElement): void {
		if (!elem.txHash) {
			return;
		}

		this.store.dispatch(ProjectAction.openProjectTab({
			componentType: 'tx',
			componentId: elem.txHash,
			title: txTabName(elem.txHash),
		}));
	}

	trackBy(_: number, element: ActionHistoryElement): string {
		return element.id;
	}
}
