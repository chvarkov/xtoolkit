import { Observable } from 'rxjs';
import { ProjectComponentType } from '../types';

export const PERSONAL_SETTINGS_MANAGER = 'CORE:PERSONAL_SETTINGS_MANAGER';

export const SELF_PROJECT_ID = 'self';

export interface OpenedProjectTab {
	index: number;
	title: string;
	componentType: ProjectComponentType;
	componentId: string;
	projectId: string;
}

export interface TabsData {
	tabs: OpenedProjectTab[];
	selectedIndex?: number;
}

export interface PersonalSettingsManager {
	getOpenedTabs(): Observable<TabsData>;

	openTab(projectId: string,
			title: string,
			componentType: ProjectComponentType,
			componentId: string): Observable<TabsData>;

	rename(projectId: string,
		   componentType: ProjectComponentType,
		   componentId: string,
		   newName: string): Observable<TabsData>;

	deleteComponent(projectId: string, componentType: ProjectComponentType, componentId: string): Observable<TabsData>;

	closeTab(index: number): Observable<TabsData>;

	moveTab(prevIndex: number, currentIndex: number): Observable<TabsData>;

	selectTab(index: number): Observable<TabsData>;
}
