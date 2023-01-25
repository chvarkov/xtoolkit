import { Inject, Injectable } from '@angular/core';
import {
	DEFAULT_PROJECT_EXPLORER_STATE,
	LayoutState,
	OpenedProjectTab,
	PersonalSettingsManager,
	ProjectExplorerExpandState, reverseTheme,
	SELF_PROJECT_ID,
	TabsData,
	Theme
} from '../personal-settings.manager';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ProjectComponentType } from '../../types';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { DATA_PROVIDER, DataProvider, Project } from '../data-provider';
import { GLOBAL_PREFIX } from './constants';

@Injectable({providedIn: 'root'})
export class LocalstoragePersonalSettingManager implements PersonalSettingsManager {
	private readonly openedTabsKey = `${GLOBAL_PREFIX}.opened_tabs`;
	private readonly currentTabIndexKey = `${GLOBAL_PREFIX}.current_tab_index`;
	private readonly layoutStateKey = `${GLOBAL_PREFIX}.layout_state`;
	private readonly projectExplorerStateKey = `${GLOBAL_PREFIX}.project_explorer_state`;

	constructor(@Inject(DATA_PROVIDER) private readonly dataProvider: DataProvider) {
	}

	getActiveProjectOpenedTabs(): Observable<TabsData> {
		return this.dataProvider.getActiveProjectId().pipe(
			map(projectId => ({
				tabs: this.getActiveProjectOpenedTabList(projectId),
				selectedIndex: this.getCurrentTabIndex(projectId),
			})),
		);
	}

	openTab(title: string,
			componentType: ProjectComponentType,
			componentId: string): Observable<TabsData> {
		return forkJoin([
			this.dataProvider.getActiveProjectId(),
			this.getActiveProjectOpenedTabs(),
		]).pipe(
			switchMap(([projectId, { tabs, selectedIndex }]) => {
				projectId = projectId || SELF_PROJECT_ID;

				tabs = tabs || [];

				const openedElem = tabs.find(i => i.componentType === componentType && i.componentId === componentId);

				if (openedElem) {

					if (openedElem.index >= 5) {
						return this.pushTabAsFirst(openedElem.index);
					}

					this.set(this.getCurrentTabKey(projectId), openedElem.index);
					return of({ tabs, selectedIndex: openedElem.index });
				}

				const updatedList: OpenedProjectTab[] = [
					{index: 0, title, componentType, componentId, projectId},
					...tabs.map((item, index) => ({...item, index: index + 1}))
				]

				this.set(this.getOpenedTabsKey(projectId), updatedList);
				this.set(this.getCurrentTabKey(projectId), 0);

				return of({ tabs: updatedList, selectedIndex: 0 });
			}),
		);
	}

	pushTabAsFirst(index: number): Observable<TabsData> {
		return forkJoin([
			this.dataProvider.getActiveProjectId(),
			this.getActiveProjectOpenedTabs(),
		]).pipe(
			map(([projectId, { tabs, selectedIndex }]) => {
				projectId = projectId || SELF_PROJECT_ID;

				tabs = tabs || [];

				const current = tabs[index];

				if (!current) {
					return {tabs, selectedIndex};
				}
				const updatedList: OpenedProjectTab[] = [
					{
						...current,
						index: 0,
					},
					...tabs
						.filter((t) => t.index !== index)
						.map((item, index) => ({
							...item,
							index: index + 1,
						})),
				];

				this.set(this.getOpenedTabsKey(projectId), updatedList);
				this.set(this.getCurrentTabKey(projectId), 0);

				return { tabs: updatedList, selectedIndex: 0 };
			}),
		);
	}

	rename(projectId: string,
		   componentType: ProjectComponentType,
		   componentId: string,
		   newName: string): Observable<TabsData> {
		return forkJoin([
			this.dataProvider.getActiveProjectId(),
			this.getActiveProjectOpenedTabs(),
		]).pipe(
			map(([projectId, { tabs, selectedIndex }]) => {
				projectId = projectId || SELF_PROJECT_ID;

				tabs = tabs || [];

				const tab = tabs.find(t => t.projectId === projectId && t.componentType === componentType && componentId === componentId);

				if (tab) {
					tab.title = newName;

					this.set(this.getOpenedTabsKey(projectId), tabs);
				}

				return { tabs, selectedIndex };
			}),
		);
	}

	deleteComponent(projectId: string, componentType: ProjectComponentType, componentId: string): Observable<TabsData> {
		return forkJoin([
			this.dataProvider.getActiveProjectId(),
			this.getActiveProjectOpenedTabs(),
		]).pipe(
			map(([projectId, { tabs, selectedIndex }]) => {
				projectId = projectId || SELF_PROJECT_ID;

				if (!tabs?.length) {
					return { tabs: [] };
				}

				if (componentType === 'project' && projectId !== componentId) {
					throw new Error('ProjectId is not equals to ComponentId for Project component');
				}

				const selectedTab = tabs[selectedIndex || 0] ? {...tabs[selectedIndex || 0]} : undefined;

				const isShouldDeleted = (t?: OpenedProjectTab) => t?.projectId === projectId &&
					t?.componentType === componentType &&
					t?.componentId === componentId;

				const isSelectedShouldBeDeleted = isShouldDeleted(selectedTab);

				tabs = componentType === 'project'
					? tabs.filter(t => t.projectId !== componentId)
					: tabs.filter(t => !isShouldDeleted(t));

				let index = selectedTab && !isSelectedShouldBeDeleted
					? tabs.findIndex(t => t.projectId === selectedTab.projectId &&
						t.componentType === selectedTab.componentType &&
						t.componentId === selectedTab.componentId)
					: 0;

				if (index === -1) {
					index = 0;
				}

				this.set(this.getOpenedTabsKey(projectId), tabs);
				this.set(this.getCurrentTabKey(projectId), index);

				return { tabs, selectedIndex: index };
			}),
		);
	}

	closeTab(index: number): Observable<TabsData> {
		return forkJoin([
			this.dataProvider.getActiveProjectId(),
			this.getActiveProjectOpenedTabs(),
		]).pipe(
			map(([projectId, { tabs }]) => {
				projectId = projectId || SELF_PROJECT_ID;

				if (!tabs?.length) {
					return { tabs: [] };
				}

				for (let i = index; i < tabs.length - 1; i++) {
					tabs[i] = tabs[i + 1];
					tabs[i].index = i;
				}

				tabs.pop();

				this.pushHomeIfListIsEmpty(tabs);

				this.set(this.getOpenedTabsKey(projectId), tabs);
				this.set(this.getCurrentTabKey(projectId), 0);

				return { tabs, selectedIndex: 0 };
			}),
		);
	}

	moveTab(prevIndex: number, currentIndex: number): Observable<TabsData> {
		return forkJoin([
			this.dataProvider.getActiveProjectId(),
			this.getActiveProjectOpenedTabs(),
		]).pipe(
			map(([projectId, { tabs, selectedIndex }]) => {
				projectId = projectId || SELF_PROJECT_ID;

				if (!tabs?.length) {
					return {tabs: []};
				}

				moveItemInArray(tabs, prevIndex, currentIndex);

				tabs.forEach((item, index) => {
					item.index = index;
				});

				// console.log(`prevIndex: ${prevIndex} / currentIndex: ${currentIndex} / selectedIndex(${typeof selectedIndex}): ${selectedIndex}`);

				if (prevIndex === (selectedIndex || 0)) {
					selectedIndex = currentIndex;
					// console.log(`currentIndex: ${selectedIndex}`);

					this.set(this.getCurrentTabKey(projectId), selectedIndex || 0);
				}

				this.set(this.getOpenedTabsKey(projectId), tabs);

				return { tabs, selectedIndex };
			}),
		);
	}

	selectTab(index: number): Observable<TabsData> {
		return forkJoin([
			this.dataProvider.getActiveProjectId(),
			this.getActiveProjectOpenedTabs(),
		]).pipe(
			map(([projectId, { tabs, selectedIndex }]) => {
				projectId = projectId || SELF_PROJECT_ID;

				if (!tabs?.length) {
					return { tabs: [] };
				}

				if (index === selectedIndex) {
					return {tabs, selectedIndex};
				}

				if (!tabs[index]) {
					throw new Error('Selected invalid tab');
				}

				this.set(this.getCurrentTabKey(projectId), index);

				return { tabs, selectedIndex: index };
			}),
		);
	}

	getLayoutState(): Observable<LayoutState> {
		const state: LayoutState = this.get(this.layoutStateKey);

		if (state) {
			return of(state);
		}

		const defaultState: LayoutState = {
			theme: Theme.Dark,
			leftPanelWidth: 420,
			rightPanelWidth: 420,
		};

		this.set(this.layoutStateKey, defaultState);

		return of(defaultState);
	}

	setLayoutState(partialState: Partial<LayoutState>): Observable<LayoutState> {
		return this.getLayoutState().pipe(
			map(state => {
				const merged = {
					...state,
					...partialState,
				};

				this.set(this.layoutStateKey, merged);

				return merged;
			}),
		);
	}

	toggleTheme(): Observable<LayoutState> {
		return this.getLayoutState().pipe(
			map(state => {
				const updatedState: LayoutState = {
					...state,
					theme: reverseTheme(state.theme),
				};

				this.set(this.layoutStateKey, updatedState);

				return updatedState;
			}),
		);
	}

	getProjectExplorerState(projectId: string): Observable<ProjectExplorerExpandState> {
		const state: ProjectExplorerExpandState = this.get(this.getProjectStateKey(projectId));

		if (state) {
			return of(state);
		}

		this.set(this.getProjectStateKey(projectId), DEFAULT_PROJECT_EXPLORER_STATE);

		return of(DEFAULT_PROJECT_EXPLORER_STATE);
	}

	updateProjectExplorerTree(projectId: string,
							  update: Partial<ProjectExplorerExpandState>): Observable<ProjectExplorerExpandState> {
		return this.getProjectExplorerState(projectId).pipe(
			map((state) => {
				const updatedState = {
					...state,
					...update,
				};

				this.set(this.getProjectStateKey(projectId), updatedState);

				return updatedState;
			}),
		);
	}

	private getActiveProjectOpenedTabList(projectId?: string): OpenedProjectTab[] {
		if (!projectId) {
			return [];
		}
		return this.pushHomeIfListIsEmpty(this.get(this.getOpenedTabsKey(projectId)) || []);
	}

	private pushHomeIfListIsEmpty(list: OpenedProjectTab[]): OpenedProjectTab[] {
		if (!list.length) {
			list.push({projectId: SELF_PROJECT_ID, title: 'Home', index: 0, componentType: 'home', componentId: SELF_PROJECT_ID});
		}

		return list;
	}

	private getProjectStateKey(projectId: string): string {
		return `${this.projectExplorerStateKey}.${projectId}`;
	}

	private getOpenedTabsKey(projectId: string): string {
		return `${this.openedTabsKey}.${projectId}`;
	}

	private getCurrentTabKey(projectId: string): string {
		return `${this.currentTabIndexKey}.${projectId}`;
	}

	private getCurrentTabIndex(projectId?: string): number {
		if (!projectId) {
			return 0;
		}
		const index = +this.get<string>(this.getCurrentTabKey(projectId));
		return !isNaN(index) ? index : 0;
	}

	private set<T>(key: string, value: T): void {
		return localStorage.setItem(key, JSON.stringify(value));
	}

	private get<T>(key: string): T {
		return JSON.parse(localStorage.getItem(key) || 'null');
	}
}
