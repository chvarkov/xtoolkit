import { Observable } from 'rxjs';
import { ProjectComponentType } from '../types';

export const PERSONAL_SETTINGS_MANAGER = 'CORE:PERSONAL_SETTINGS_MANAGER';

export interface OpenedProjectTab {
	index: number;
	title: string;
	componentType: ProjectComponentType;
	componentId: string;
}

export interface TabsData {
	tabs: OpenedProjectTab[];
	selectedIndex?: number;
}

export interface PersonalSettingsManager {
	getOpenedTabs(): Observable<TabsData>;

	openTab(title: string,
			componentType: ProjectComponentType,
			componentId: string): Observable<TabsData>;

	closeTab(index: number): Observable<TabsData>;

	moveTab(prevIndex: number, currentIndex: number): Observable<TabsData>;

	selectTab(index: number): Observable<TabsData>;
}
