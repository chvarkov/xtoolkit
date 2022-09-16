import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NetworkAction } from './network/store/network.action';
import { NetworkSelector } from './network/store/network.selector';
import { Observable } from 'rxjs';
import { ProjectScAbi } from './core/data-provider/data-provider';
import { ProjectSelector } from './project/store/project.selector';
import { OpenedProjectTab } from './core/data-provider/personal-settings.manager';
import { ProjectAction } from './project/store/project.action';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'elrond-sc';

	selectedSc$: Observable<ProjectScAbi | undefined>;

	openedTabs$: Observable<OpenedProjectTab[]>;

	currentTabIndex$: Observable<number | undefined>;

	constructor(private readonly store: Store) {
		this.store.select(NetworkSelector.selectedNetwork).subscribe(data => console.log('selected network', data));
		this.selectedSc$ = this.store.select(ProjectSelector.selectedSc);
		this.openedTabs$ = this.store.select(ProjectSelector.openedTabs);
		this.currentTabIndex$ = this.store.select(ProjectSelector.currentTabIndex);
	}

	async ngOnInit(): Promise<void> {
		this.store.dispatch(NetworkAction.loadNetworks());
		setTimeout(() => this.store.dispatch(ProjectAction.loadProjectTabs()));
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
}
