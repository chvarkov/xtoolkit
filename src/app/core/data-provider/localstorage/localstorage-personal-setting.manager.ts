import { Injectable } from '@angular/core';
import { OpenedProjectTab, PersonalSettingsManager } from '../personal-settings.manager';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectComponentType } from '../../types';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Injectable({providedIn: 'root'})
export class LocalstoragePersonalSettingManager implements PersonalSettingsManager {
	private readonly globalPrefix = 'elrond-sc';
	private readonly openedTabsKey = `${this.globalPrefix}.opened_tabs`;

	getOpenedTabs(): Observable<OpenedProjectTab[]> {
		return of(this.get(this.openedTabsKey) || []);
	}

	openTab(title: string,
			componentType: ProjectComponentType,
			componentId: string): Observable<OpenedProjectTab[]> {
		return this.getOpenedTabs().pipe(
			map(list => {
				if (!list?.length) {
					return [];
				}

				const updatedList: OpenedProjectTab[] = [
					{index: 0, title, componentType, componentId},
					...list.map((item, index) => ({...item, index: index + 1}))
				]

				this.set(this.openedTabsKey, updatedList);

				return updatedList;
			}),
		);
	}

	closeTab(index: number): Observable<OpenedProjectTab[]> {
		return this.getOpenedTabs().pipe(
			map(list => {
				if (!list?.length) {
					return [];
				}

				for (let i = index; i < list.length - 1; i++) {
					list[i] = list[i + 1];
					list[i].index = i;
				}

				list.pop();

				this.set(this.openedTabsKey, list);

				return list;
			}),
		);
	}

	moveTab(prevIndex: number, currentIndex: number): Observable<OpenedProjectTab[]> {
		return this.getOpenedTabs().pipe(
			map(list => {
				if (!list?.length) {
					return [];
				}

				moveItemInArray(list, prevIndex, currentIndex);

				list.forEach((item, index) => {
					item.index = index;
				});
				
				this.set(this.openedTabsKey, list);

				return list;
			}),
		);
	}

	private set<T>(key: string, value: T): void {
		return localStorage.setItem(key, JSON.stringify(value));
	}

	private get<T>(key: string): T {
		return JSON.parse(localStorage.getItem(key) || 'null');
	}
}
