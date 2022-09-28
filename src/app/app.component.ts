import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NetworkAction } from './network/store/network.action';
import { Observable } from 'rxjs';
import { ProjectScAbi } from './core/data-provider/data-provider';
import { ProjectSelector } from './project/store/project.selector';
import { OpenedProjectTab } from './core/data-provider/personal-settings.manager';
import { ProjectAction } from './project/store/project.action';
import { map } from 'rxjs/operators';
import { TokenIssueAwaiter } from './project/services/token-issue.awaiter';
import { LayoutSelector } from './layout/store/layout.selector';
import { LayoutAction } from './layout/store/layout.action';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
	title = 'elrond-sc';

	openedTabs$: Observable<OpenedProjectTab[]>;

	currentTabIndex$: Observable<number | undefined>;

	isVisibleLoadingScreen$: Observable<boolean>;

	constructor(private readonly store: Store,
				private readonly tokenIssueAwaiter: TokenIssueAwaiter) {
		this.openedTabs$ = this.store.select(ProjectSelector.openedTabs);
		this.currentTabIndex$ = this.store.select(ProjectSelector.currentTabIndex);
		this.isVisibleLoadingScreen$ = this.store.select(LayoutSelector.isLoadingScreenVisible);
	}

	async ngOnInit(): Promise<void> {
		this.store.dispatch(NetworkAction.loadNetworks());
		setTimeout(() => {
			this.store.dispatch(ProjectAction.loadProjectTabs());
		});

		this.tokenIssueAwaiter.enable();

		this.store.dispatch(ProjectAction.loadTokenIssueWaitList());

		setTimeout(() => {
			this.store.dispatch(LayoutAction.toggleLoadingScreen({visible: false}));
		}, 2600);
	}

	ngOnDestroy() {
		this.tokenIssueAwaiter.disable();
	}

	moveTab(prevIndex: number, currentIndex: number): void {
		this.store.dispatch(ProjectAction.moveProjectTab({prevIndex, currentIndex}));
	}

	closeTab(index: number): void {
		this.store.dispatch(ProjectAction.closeProjectTab({index}));
	}

	selectTab(index: number): void {
		this.store.dispatch(ProjectAction.selectTab({index}));
	}

	getScById$(projectId: string, scId: string): Observable<ProjectScAbi | undefined> {
		return this.store.select(ProjectSelector.smartContractsById(projectId, scId));
	}

	getProjectChainId$(projectId: string): Observable<string> {
		return this.store.select(ProjectSelector.projectById(projectId))
			.pipe(
				map(proj => proj?.chainId || '')
			);
	}
}
