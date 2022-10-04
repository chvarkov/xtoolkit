import { Injectable } from '@angular/core';
import {
	LayoutState,
	OpenedProjectTab,
	PersonalSettingsManager,
	SELF_PROJECT_ID,
	TabsData
} from '../personal-settings.manager';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectComponentType } from '../../types';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Injectable({providedIn: 'root'})
export class LocalstoragePersonalSettingManager implements PersonalSettingsManager {
	private readonly globalPrefix = 'elrond-sc';
	private readonly openedTabsKey = `${this.globalPrefix}.opened_tabs`;
	private readonly currentTabIndexKey = `${this.globalPrefix}.current_tab_index`;
	private readonly layoutStateKey = `${this.globalPrefix}.layout_state`;

	getOpenedTabs(): Observable<TabsData> {
		return of({
			tabs: this.getOpenedTabList(),
			selectedIndex: this.getCurrentTabIndex(),
		});
	}

	openTab(projectId: string,
			title: string,
			componentType: ProjectComponentType,
			componentId: string): Observable<TabsData> {
		return this.getOpenedTabs().pipe(
			map(({ tabs, selectedIndex }) => {
				tabs = tabs || [];

				const openedElem = tabs.find(i => i.componentType === componentType && i.componentId === componentId);

				if (openedElem) {
					return { tabs, selectedIndex: openedElem.index };
				}

				const updatedList: OpenedProjectTab[] = [
					{index: 0, title, componentType, componentId, projectId},
					...tabs.map((item, index) => ({...item, index: index + 1}))
				]

				this.set(this.openedTabsKey, updatedList);
				this.set(this.currentTabIndexKey, 0);

				return { tabs: updatedList, selectedIndex: 0 };
			}),
		);
	}

	rename(projectId: string,
		   componentType: ProjectComponentType,
		   componentId: string,
		   newName: string): Observable<TabsData> {
		return this.getOpenedTabs().pipe(
			map(({ tabs, selectedIndex }) => {
				tabs = tabs || [];

				const tab = tabs.find(t => t.projectId === projectId && t.componentType === componentType && componentId === componentId);

				if (tab) {
					tab.title = newName;

					this.set(this.openedTabsKey, tabs);
				}

				return { tabs, selectedIndex };
			}),
		);
	}

	deleteComponent(projectId: string, componentType: ProjectComponentType, componentId: string): Observable<TabsData> {
		return this.getOpenedTabs().pipe(
			map(({ tabs, selectedIndex }) => {
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

				this.set(this.openedTabsKey, tabs);
				this.set(this.currentTabIndexKey, index);

				return { tabs, selectedIndex: index };
			}),
		);
	}

	closeTab(index: number): Observable<TabsData> {
		return this.getOpenedTabs().pipe(
			map(({ tabs }) => {
				if (!tabs?.length) {
					return { tabs: [] };
				}

				for (let i = index; i < tabs.length - 1; i++) {
					tabs[i] = tabs[i + 1];
					tabs[i].index = i;
				}

				tabs.pop();

				this.pushHomeIfListIsEmpty(tabs);

				this.set(this.openedTabsKey, tabs);
				this.set(this.currentTabIndexKey, 0);

				return { tabs, selectedIndex: 0 };
			}),
		);
	}

	moveTab(prevIndex: number, currentIndex: number): Observable<TabsData> {
		return this.getOpenedTabs().pipe(
			map(({ tabs, selectedIndex }) => {
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

					this.set(this.currentTabIndexKey, selectedIndex || 0);
				}

				this.set(this.openedTabsKey, tabs);

				return { tabs, selectedIndex };
			}),
		);
	}

	selectTab(index: number): Observable<TabsData> {
		return this.getOpenedTabs().pipe(
			map(({ tabs, selectedIndex }) => {
				if (!tabs?.length) {
					return { tabs: [] };
				}

				if (index === selectedIndex) {
					return {tabs, selectedIndex};
				}

				if (!tabs[index]) {
					throw new Error('Selected invalid tab');
				}

				this.set(this.currentTabIndexKey, index);

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

	private getOpenedTabList(): OpenedProjectTab[] {
		return this.pushHomeIfListIsEmpty(this.get(this.openedTabsKey) || []);
	}

	private pushHomeIfListIsEmpty(list: OpenedProjectTab[]): OpenedProjectTab[] {
		if (!list.length) {
			list.push({projectId: SELF_PROJECT_ID, title: 'Home', index: 0, componentType: 'home', componentId: SELF_PROJECT_ID});
		}

		return list;
	}

	private getCurrentTabIndex(): number {
		const index = +this.get<string>(this.currentTabIndexKey);
		return !isNaN(index) ? index : 0;
	}

	private set<T>(key: string, value: T): void {
		return localStorage.setItem(key, JSON.stringify(value));
	}

	private get<T>(key: string): T {
		return JSON.parse(localStorage.getItem(key) || 'null');
	}
}
