import { Injectable } from '@angular/core';
import { OpenedProjectTab, PersonalSettingsManager, TabsData } from '../personal-settings.manager';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectComponentType } from '../../types';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Injectable({providedIn: 'root'})
export class LocalstoragePersonalSettingManager implements PersonalSettingsManager {
	private readonly globalPrefix = 'elrond-sc';
	private readonly openedTabsKey = `${this.globalPrefix}.opened_tabs`;
	private readonly currentTabIndexKey = `${this.globalPrefix}.current_tab_index`;

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

	private getOpenedTabList(): OpenedProjectTab[] {
		return this.get(this.openedTabsKey) || [];
	}

	private getCurrentTabIndex(): number | undefined {
		return this.get(this.currentTabIndexKey) || undefined;
	}

	private set<T>(key: string, value: T): void {
		return localStorage.setItem(key, JSON.stringify(value));
	}

	private get<T>(key: string): T {
		return JSON.parse(localStorage.getItem(key) || 'null');
	}
}
